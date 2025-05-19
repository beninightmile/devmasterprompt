import { DetectedSection } from './types';

/**
 * Parse sections based on markdown headings (## Section Name)
 */
export function parseMarkdownHeadings(text: string): DetectedSection[] {
  const sections: DetectedSection[] = [];
  const lines = text.split('\n');
  let currentSection: DetectedSection | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const headingMatch = line.match(/^#{1,3}\s+(.+)$/);
    
    if (headingMatch) {
      // If we found a heading and had a previous section, save it
      if (currentSection && currentSection.content.trim()) {
        sections.push(currentSection);
      }
      
      // Start a new section
      currentSection = {
        name: headingMatch[1].trim(),
        content: ''
      };
    } else if (currentSection) {
      // Add this line to the current section's content
      currentSection.content += line + '\n';
    } else if (line.trim()) {
      // Text before any heading becomes "Introduction" section
      currentSection = {
        name: 'Introduction',
        content: line + '\n'
      };
    }
  }
  
  // Add the final section if there is one
  if (currentSection && currentSection.content.trim()) {
    sections.push(currentSection);
  }
  
  return sections;
}

/**
 * Parse numbered sections like "1. Section Name" or "1.1 Section Name"
 */
export function parseNumberedSections(text: string): DetectedSection[] {
  const sections: DetectedSection[] = [];
  const lines = text.split('\n');
  let currentSection: DetectedSection | null = null;
  
  // Regular expression for numbered section headers
  // Matches patterns like:
  // 1. Section Name
  // 1.1 Section Name
  // 1.1. Section Name
  const numberedHeaderRegex = /^(\d+\.|\d+\.\d+\.?)\s+([^\n]+)$/;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const headerMatch = line.match(numberedHeaderRegex);
    
    if (headerMatch) {
      // We found a numbered heading
      if (currentSection && currentSection.content.trim()) {
        sections.push(currentSection);
      }
      
      // Start a new section, keeping the number prefix for clarity
      currentSection = {
        name: line.trim(), // Keep the full line as the section name including the number
        content: ''
      };
    } else if (currentSection) {
      // Add this line to the current section's content
      currentSection.content += line + '\n';
    } else if (line.trim()) {
      // Text before any heading becomes "Introduction" section
      currentSection = {
        name: 'Introduction',
        content: line + '\n'
      };
    }
  }
  
  // Add the final section if there is one
  if (currentSection && currentSection.content.trim()) {
    sections.push(currentSection);
  }
  
  return sections;
}

/**
 * Parse sections with special prefixes like "@Core_1: Section Name"
 */
export function parsePrefixedSections(text: string): DetectedSection[] {
  const sections: DetectedSection[] = [];
  const lines = text.split('\n');
  let currentSection: DetectedSection | null = null;
  
  // Regular expression for prefixed section headers
  // Matches patterns like:
  // @Core_1: Section Name
  // @Feature-2: Section Description
  const prefixedHeaderRegex = /^(@[A-Za-z0-9_\-]+)(?:\:|\s+\:)\s*(.+)$/;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const headerMatch = line.match(prefixedHeaderRegex);
    
    if (headerMatch) {
      // We found a prefixed heading
      if (currentSection && currentSection.content.trim()) {
        sections.push(currentSection);
      }
      
      // Start a new section
      currentSection = {
        name: `${headerMatch[1]}: ${headerMatch[2]}`.trim(),
        content: ''
      };
    } else if (currentSection) {
      // Add this line to the current section's content
      currentSection.content += line + '\n';
    } else if (line.trim()) {
      // Text before any heading becomes "Introduction" section
      currentSection = {
        name: 'Introduction',
        content: line + '\n'
      };
    }
  }
  
  // Add the final section if there is one
  if (currentSection && currentSection.content.trim()) {
    sections.push(currentSection);
  }
  
  return sections;
}

/**
 * Parse sections with colon-separated titles (Section Name: content)
 */
export function parseColonSeparatedSections(text: string): DetectedSection[] {
  const sections: DetectedSection[] = [];
  const lines = text.split('\n');
  let currentSection: DetectedSection | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Improved colon detection regex
    // Matches clear label-like patterns at the start of a line
    // More specific to avoid false positives in normal text with colons
    const colonMatch = line.match(/^([A-Za-z0-9_\- ]{2,50}?):\s*(.*)$/);
    
    // Check if it looks like a section header (contains a word followed by a colon)
    // and isn't just a typical sentence with a colon
    if (colonMatch && !line.includes(',') && colonMatch[1].trim().length < 50) {
      // If we found a potential section header and had a previous section, save it
      if (currentSection && currentSection.content.trim()) {
        sections.push(currentSection);
      }
      
      // Start a new section
      currentSection = {
        name: colonMatch[1].trim(),
        content: colonMatch[2] ? colonMatch[2].trim() + '\n' : ''
      };
    } else if (currentSection) {
      // Add this line to the current section's content
      currentSection.content += line + '\n';
    } else if (line.trim()) {
      // Text before any pattern becomes "Introduction" section
      currentSection = {
        name: 'Introduction',
        content: line + '\n'
      };
    }
  }
  
  // Add the final section if there is one
  if (currentSection && currentSection.content.trim()) {
    sections.push(currentSection);
  }
  
  return sections;
}

/**
 * Parse sections based on paragraph breaks
 */
export function parseParagraphs(text: string): DetectedSection[] {
  // Split on 2+ consecutive newlines OR clear paragraph breaks with indentation patterns
  const paragraphSplits = text.split(/\n{2,}|\n[ \t]+\n/);
  const sections: DetectedSection[] = [];
  
  // Only use paragraph parsing if we have a reasonable number of paragraphs
  // (too many tiny sections isn't helpful)
  if (paragraphSplits.length < 3 || paragraphSplits.length > 20) {
    return [];
  }
  
  for (let i = 0; i < paragraphSplits.length; i++) {
    const paragraph = paragraphSplits[i].trim();
    if (!paragraph) continue;
    
    // Try to extract a title from the first line
    const lines = paragraph.split('\n');
    let title = '';
    let content = paragraph;
    
    if (lines[0] && lines[0].length < 80) {
      // Use first line as title if it's reasonably short and looks like a heading
      // (capitalized, doesn't end with a period, etc.)
      const firstLine = lines[0].trim();
      if (
        firstLine === firstLine.toUpperCase() || // ALL CAPS
        /^[A-Z]/.test(firstLine) && // Starts with capital letter
        !firstLine.endsWith('.') // Doesn't end with period
      ) {
        title = firstLine.replace(/[:.!?]+$/, '');
        content = lines.slice(1).join('\n').trim();
        
        // If we didn't get any content, use the title as content too
        if (!content) {
          content = title;
        }
      }
    }
    
    sections.push({
      name: title || `Section ${i + 1}`,
      content: content
    });
  }
  
  return sections;
}
