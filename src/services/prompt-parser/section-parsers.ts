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
    // Enhanced regex to capture heading level for hierarchical structure
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    
    if (headingMatch) {
      // If we found a heading and had a previous section, save it
      if (currentSection && currentSection.content.trim()) {
        sections.push(currentSection);
      }
      
      // Get heading level (number of # chars) for hierarchical structure
      const headingLevel = headingMatch[1].length;
      
      // Start a new section with level metadata
      currentSection = {
        name: headingMatch[2].trim(),
        content: '',
        level: headingLevel // Store heading level for hierarchical display
      };
    } else if (currentSection) {
      // Add this line to the current section's content
      currentSection.content += line + '\n';
    } else if (line.trim()) {
      // Text before any heading becomes "Introduction" section
      currentSection = {
        name: 'Introduction',
        content: line + '\n',
        level: 1
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
 * Improved to handle deeper hierarchical sections like "1.1.1 Subsection"
 */
export function parseNumberedSections(text: string): DetectedSection[] {
  const sections: DetectedSection[] = [];
  const lines = text.split('\n');
  let currentSection: DetectedSection | null = null;
  
  // Enhanced regex for numbered section headers with better hierarchical support
  // Matches patterns like:
  // 1. Section Name
  // 1.1 Section Name
  // 1.1.1 Subsection Name
  // 1.1.1. Another variation
  const numberedHeaderRegex = /^(\d+(?:\.\d+)*\.?)\s+([^\n]+)$/;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const headerMatch = line.match(numberedHeaderRegex);
    
    if (headerMatch) {
      // We found a numbered heading
      if (currentSection && currentSection.content.trim()) {
        sections.push(currentSection);
      }
      
      // Calculate hierarchical level based on number of segments
      const levelIndicator = headerMatch[1];
      const level = levelIndicator.split('.').filter(Boolean).length;
      
      // Start a new section
      currentSection = {
        name: line.trim(), // Keep the full line as the section name including the number
        content: '',
        level: level,      // Store the hierarchical level
        numberPrefix: levelIndicator.trim(), // Store the original number prefix for sorting
        order: i           // Store the line position for ordering
      };
    } else if (currentSection) {
      // Add this line to the current section's content
      currentSection.content += line + '\n';
    } else if (line.trim()) {
      // Text before any heading becomes "Introduction" section
      currentSection = {
        name: 'Introduction',
        content: line + '\n',
        level: 1,
        order: 0
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
 * Enhanced to better support block-style prefixed sections
 */
export function parsePrefixedSections(text: string): DetectedSection[] {
  const sections: DetectedSection[] = [];
  const lines = text.split('\n');
  let currentSection: DetectedSection | null = null;
  
  // Enhanced regex for prefixed section headers - improved for @Core_X formats
  // Supports various prefix patterns including @Core_1:, Block 1:, Feature 1.2:, etc.
  // Also handles whitespace variations between prefix and colon
  const prefixedHeaderRegex = /^(@[A-Za-z0-9_\-]+|\b(?:Block|Feature|Core|Section)\s+(?:\d+(?:\.\d+)*))(?:\s*\:|\s+\:)\s*(.+)$/i;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const headerMatch = line.match(prefixedHeaderRegex);
    
    if (headerMatch) {
      // We found a prefixed heading
      if (currentSection && currentSection.content.trim()) {
        sections.push(currentSection);
      }
      
      // Extract prefix and calculate a hierarchical level
      const prefix = headerMatch[1].trim();
      let level = 1; // Default level
      
      // Try to determine level from prefix if possible
      if (prefix.includes('_')) {
        // For @Core_1 style, use the number
        const levelMatch = prefix.match(/_(\d+)/);
        if (levelMatch) level = parseInt(levelMatch[1], 10);
      } else if (prefix.match(/\d+/)) {
        // For Block 1 style, use the number
        const levelMatch = prefix.match(/\d+/);
        if (levelMatch) level = parseInt(levelMatch[0], 10);
      }
      
      // Start a new section
      currentSection = {
        name: `${prefix}: ${headerMatch[2]}`.trim(),
        content: '',
        level: level,
        blockPrefix: prefix, // Store the original prefix for grouping
        order: i            // Store the line position for ordering
      };
    } else if (currentSection) {
      // Add this line to the current section's content
      currentSection.content += line + '\n';
    } else if (line.trim()) {
      // Text before any heading becomes "Introduction" section
      currentSection = {
        name: 'Introduction',
        content: line + '\n',
        level: 1,
        order: 0
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
        content: colonMatch[2] ? colonMatch[2].trim() + '\n' : '',
        level: 1, // Default level for colon sections
        order: i  // Store the line position for ordering
      };
    } else if (currentSection) {
      // Add this line to the current section's content
      currentSection.content += line + '\n';
    } else if (line.trim()) {
      // Text before any pattern becomes "Introduction" section
      currentSection = {
        name: 'Introduction',
        content: line + '\n',
        level: 1,
        order: 0
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
      content: content,
      level: 1, // Default level for paragraph sections
      order: i  // Store the position for ordering
    });
  }
  
  return sections;
}

/**
 * New method: Combine parsing strategies and try to maintain hierarchical structure
 * This method will analyze the text with multiple strategies and choose the best result
 */
export function parseMixedFormatSections(text: string): DetectedSection[] {
  // Try all parsing strategies
  const markdownSections = parseMarkdownHeadings(text);
  const numberedSections = parseNumberedSections(text);
  const prefixedSections = parsePrefixedSections(text);
  const colonSections = parseColonSeparatedSections(text);
  
  // Choose the strategy that detected the most sections
  // Prioritize structured formats over paragraphs
  let bestSections: DetectedSection[] = [];
  let bestSectionCount = 0;
  
  // Check which parser found the most sections
  if (markdownSections.length > bestSectionCount) {
    bestSections = markdownSections;
    bestSectionCount = markdownSections.length;
  }
  
  if (numberedSections.length > bestSectionCount) {
    bestSections = numberedSections;
    bestSectionCount = numberedSections.length;
  }
  
  if (prefixedSections.length > bestSectionCount) {
    bestSections = prefixedSections;
    bestSectionCount = prefixedSections.length;
  }
  
  if (colonSections.length > bestSectionCount) {
    bestSections = colonSections;
    bestSectionCount = colonSections.length;
  }
  
  // If we found sections, return them
  if (bestSectionCount > 1) {
    return bestSections;
  }
  
  // If no structured sections were found, try paragraph parsing as a last resort
  const paragraphSections = parseParagraphs(text);
  if (paragraphSections.length > 1) {
    return paragraphSections;
  }
  
  // If still no sections, return the entire text as one section
  return [{ 
    name: 'Unsorted Content', 
    content: text.trim(),
    level: 1,
    order: 0
  }];
}

/**
 * NEW PARSER: For specifically handling mixed formats in the same document
 * This is especially useful for documents that have BOTH numbered sections AND prefixed sections
 */
export function parseCombinedFormatSections(text: string): DetectedSection[] {
  const sections: DetectedSection[] = [];
  const lines = text.split('\n');
  let currentSection: DetectedSection | null = null;
  
  // Combined regex that can detect BOTH numbered sections AND prefixed sections
  const combinedHeaderRegex = /^(?:(\d+(?:\.\d+)*\.?)\s+([^\n]+)|(@[A-Za-z0-9_\-]+|\b(?:Block|Feature|Core|Section)\s+(?:\d+(?:\.\d+)*))(?:\s*\:|\s+\:)\s*(.+))$/i;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const headerMatch = line.match(combinedHeaderRegex);
    
    if (headerMatch) {
      // If we found a heading and had a previous section, save it
      if (currentSection && currentSection.content.trim()) {
        sections.push(currentSection);
      }
      
      // Check if we matched a numbered section or a prefixed section
      if (headerMatch[1]) {
        // This is a numbered section
        const levelIndicator = headerMatch[1];
        const level = levelIndicator.split('.').filter(Boolean).length;
        
        currentSection = {
          name: `${levelIndicator} ${headerMatch[2]}`.trim(),
          content: '',
          level: level,
          numberPrefix: levelIndicator.trim(),
          order: i
        };
      } else {
        // This is a prefixed section
        const prefix = headerMatch[3].trim();
        let level = 1; // Default level
        
        // Try to determine level from prefix
        if (prefix.includes('_')) {
          const levelMatch = prefix.match(/_(\d+)/);
          if (levelMatch) level = parseInt(levelMatch[1], 10);
        } else if (prefix.match(/\d+/)) {
          const levelMatch = prefix.match(/\d+/);
          if (levelMatch) level = parseInt(levelMatch[0], 10);
        }
        
        currentSection = {
          name: `${prefix}: ${headerMatch[4]}`.trim(),
          content: '',
          level: level,
          blockPrefix: prefix,
          order: i
        };
      }
    } else if (currentSection) {
      // Add this line to the current section's content
      currentSection.content += line + '\n';
    } else if (line.trim()) {
      // Text before any heading becomes "Introduction" section
      currentSection = {
        name: 'Introduction',
        content: line + '\n',
        level: 1,
        order: 0
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
 * Advanced parse that attempts to recognize complex documents with mixed formatting
 * This uses a hybrid approach and retains hierarchical information
 */
export function parseComplexDocument(text: string): DetectedSection[] {
  // First, try the new combined format parser which handles mixed formats
  const combinedSections = parseCombinedFormatSections(text);
  if (combinedSections.length > 1) {
    // Post-process to enhance the structure
    enhanceHierarchicalStructure(combinedSections);
    return combinedSections;
  }
  
  // If the combined parser didn't find enough sections, 
  // try all parsers and merge their results by position
  const allSections: DetectedSection[] = [];
  
  // Add sections from all parsers
  allSections.push(...parseMarkdownHeadings(text)
    .filter(section => section.content.trim()));
  allSections.push(...parseNumberedSections(text)
    .filter(section => section.content.trim()));
  allSections.push(...parsePrefixedSections(text)
    .filter(section => section.content.trim()));
  
  // If we've found multiple sections from different parsers
  if (allSections.length > 1) {
    // Sort sections by their position in the document (order property)
    allSections.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      return 0;
    });
    
    // Deduplicate sections that might overlap
    const dedupedSections = deduplicateSections(allSections);
    
    // Build parent-child relationships
    enhanceHierarchicalStructure(dedupedSections);
    
    return dedupedSections;
  }
  
  // If we still don't have a good result, fall back to the mixed format parser
  const mixedSections = parseMixedFormatSections(text);
  if (mixedSections.length > 1) {
    enhanceHierarchicalStructure(mixedSections);
    return mixedSections;
  }
  
  // Last resort: try colon sections and paragraphs
  const colonSections = parseColonSeparatedSections(text);
  if (colonSections.length > 1) {
    enhanceHierarchicalStructure(colonSections);
    return colonSections;
  }
  
  const paragraphSections = parseParagraphs(text);
  if (paragraphSections.length > 1) {
    return paragraphSections;
  }
  
  // If nothing worked, return the text as one section
  return [{ 
    name: 'Unsorted Content', 
    content: text.trim(),
    level: 1,
    order: 0
  }];
}

/**
 * Helper to deduplicate sections that might overlap (from different parsers)
 */
function deduplicateSections(sections: DetectedSection[]): DetectedSection[] {
  // Sort by order first to ensure we keep the earliest occurrence
  sections.sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    return 0;
  });
  
  // Use a map to track content we've seen
  const contentFingerprints = new Map<string, boolean>();
  const dedupedSections: DetectedSection[] = [];
  
  for (const section of sections) {
    // Create a simple fingerprint of the content (first 50 chars)
    const contentStart = section.content.trim().slice(0, 50);
    
    // If we haven't seen this content before, keep this section
    if (!contentFingerprints.has(contentStart)) {
      contentFingerprints.set(contentStart, true);
      dedupedSections.push(section);
    }
  }
  
  return dedupedSections;
}

/**
 * Helper function to enhance the hierarchical structure of sections
 * This modifies the sections array in place
 */
function enhanceHierarchicalStructure(sections: DetectedSection[]): void {
  // Ensure all sections have a level property
  sections.forEach(section => {
    if (section.level === undefined) {
      section.level = 1;
    }
  });
  
  // Try to detect parent-child relationships
  for (let i = 0; i < sections.length; i++) {
    const currentSection = sections[i];
    const nextSection = i < sections.length - 1 ? sections[i + 1] : null;
    
    if (nextSection && currentSection.level && nextSection.level) {
      // If the next section has a deeper level, mark the relationship
      if (nextSection.level > currentSection.level) {
        nextSection.parentId = currentSection.id;
      }
      // If they're at the same level, they share the same parent
      else if (nextSection.level === currentSection.level && currentSection.parentId) {
        nextSection.parentId = currentSection.parentId;
      }
      // If the next section is at a higher level than this one, we need to find an appropriate parent
      else if (nextSection.level < currentSection.level && i > 0) {
        // Look backwards to find the appropriate parent at this level
        for (let j = i - 1; j >= 0; j--) {
          if (sections[j].level === nextSection.level) {
            if (sections[j].parentId) {
              nextSection.parentId = sections[j].parentId;
            }
            break;
          } else if (sections[j].level < nextSection.level) {
            nextSection.parentId = sections[j].id;
            break;
          }
        }
      }
    }
  }
}
