import { PromptSection } from '@/types/prompt';
import { defaultPromptSections } from '@/core/registry';

type DetectedSection = {
  name: string;
  content: string;
};

/**
 * Parse free-form text into sections based on various patterns
 */
export function parseTextIntoSections(text: string): DetectedSection[] {
  if (!text || typeof text !== 'string') {
    return [];
  }
  
  // Try different section detection strategies in order of preference
  
  // 1. Try to detect sections based on markdown headings (## Section Name)
  const markdownSections = parseMarkdownHeadings(text);
  if (markdownSections.length > 1) {
    return markdownSections;
  }
  
  // 2. Try to detect numbered sections (1. Section Name or 1.1 Section Name)
  const numberedSections = parseNumberedSections(text);
  if (numberedSections.length > 1) {
    return numberedSections;
  }
  
  // 3. Try to detect special prefixed sections (@Core_1: Section Name)
  const prefixedSections = parsePrefixedSections(text);
  if (prefixedSections.length > 1) {
    return prefixedSections;
  }
  
  // 4. Fall back to looking for colon-separated titles (Section Name: content)
  const colonSections = parseColonSeparatedSections(text);
  if (colonSections.length > 1) {
    return colonSections;
  }
  
  // 5. Fall back to paragraph detection for larger blocks of text
  const paragraphSections = parseParagraphs(text);
  if (paragraphSections.length > 1) {
    return paragraphSections;
  }
  
  // If no sections could be detected, return the entire text as one section
  return [{ name: 'Unsorted Content', content: text.trim() }];
}

/**
 * Try to match detected sections with default template sections when possible
 */
export function matchWithDefaultSections(detectedSections: DetectedSection[]): PromptSection[] {
  const defaultSectionsMap = new Map(
    defaultPromptSections.map(section => [section.name.toLowerCase(), section])
  );
  
  return detectedSections.map((detectedSection, index) => {
    // Try to find a matching default section
    const matchedDefault = findMatchingDefaultSection(detectedSection.name, defaultSectionsMap);
    
    if (matchedDefault) {
      // If found, use the default section's properties with the detected content
      return {
        id: matchedDefault.id,
        name: matchedDefault.name,
        content: detectedSection.content,
        order: matchedDefault.order,
        isRequired: matchedDefault.isRequired
      };
    } else {
      // Otherwise create a new custom section
      return {
        id: crypto.randomUUID(),
        name: detectedSection.name,
        content: detectedSection.content,
        order: index + defaultPromptSections.length,
        isRequired: false
      };
    }
  });
}

// Helper functions for section detection

function parseMarkdownHeadings(text: string): DetectedSection[] {
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
function parseNumberedSections(text: string): DetectedSection[] {
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
function parsePrefixedSections(text: string): DetectedSection[] {
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

function parseColonSeparatedSections(text: string): DetectedSection[] {
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

function parseParagraphs(text: string): DetectedSection[] {
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

function findMatchingDefaultSection(detectedName: string, defaultSectionsMap: Map<string, any>): any | undefined {
  const normalizedName = detectedName.toLowerCase();
  
  // Direct match
  if (defaultSectionsMap.has(normalizedName)) {
    return defaultSectionsMap.get(normalizedName);
  }
  
  // Strip common prefixes for matching
  const strippedName = normalizedName
    .replace(/^(\d+\.|\d+\.\d+\.?)\s+/, '') // Remove numbered prefixes
    .replace(/^@[a-z0-9_\-]+:\s*/i, '');    // Remove @Core_X: type prefixes
  
  if (defaultSectionsMap.has(strippedName)) {
    return defaultSectionsMap.get(strippedName);
  }
  
  // Partial match - check if any default section name is contained in the detected name
  for (const [defaultName, section] of defaultSectionsMap.entries()) {
    if (normalizedName.includes(defaultName) || 
        defaultName.includes(normalizedName) ||
        strippedName.includes(defaultName) ||
        defaultName.includes(strippedName)) {
      return section;
    }
  }
  
  return undefined;
}
