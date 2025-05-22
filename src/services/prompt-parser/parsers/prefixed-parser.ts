
import { DetectedSection } from '../types';

/**
 * Parse sections with special prefixes like "@@Core_1: Section Name" or "@Core_1: Section Name"
 * Enhanced to better support block-style prefixed sections and area recognition
 */
export function parsePrefixedSections(text: string): DetectedSection[] {
  const sections: DetectedSection[] = [];
  const lines = text.split('\n');
  let currentSection: DetectedSection | null = null;
  let currentArea: DetectedSection | null = null;
  
  // Enhanced regex for prefixed section headers
  // Supports both @ and @@ prefixes for different levels
  const prefixedHeaderRegex = /^(@@|@)([A-Za-z0-9_\-]+)(?:\s*\:|\s+\:)\s*(.+)$/i;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const headerMatch = line.match(prefixedHeaderRegex);
    
    if (headerMatch) {
      // We found a prefixed heading
      if (currentSection && currentSection.content.trim()) {
        sections.push(currentSection);
      }
      
      const prefix = headerMatch[1]; // @@ or @
      const identifier = headerMatch[2]; // Core_1, etc
      const title = headerMatch[3].trim();
      const fullPrefix = `${prefix}${identifier}`;
      const isArea = prefix === '@@';
      
      // Try to determine level from prefix if possible
      let level = 1; // Default level
      
      if (identifier.includes('_')) {
        // For @Core_1 style, use the number
        const levelMatch = identifier.match(/_(\d+)/);
        if (levelMatch) level = parseInt(levelMatch[1], 10);
      }
      
      // Start a new section
      const newSection = {
        name: `${title}`,
        content: '',
        level: isArea ? 1 : 2, // Areas are level 1, child sections are level 2+
        blockPrefix: fullPrefix,
        isArea: isArea,
        order: i,
        parentId: isArea ? undefined : currentArea?.id
      };
      
      // If this is an area, update currentArea reference
      if (isArea) {
        currentArea = newSection;
      }
      
      currentSection = newSection;
      sections.push(currentSection);
    } else if (currentSection) {
      // Add this line to the current section's content
      currentSection.content += line + '\n';
    } else if (line.trim()) {
      // Text before any heading becomes "Introduction" section
      currentSection = {
        name: 'Unsorted Content',
        content: line + '\n',
        level: 1,
        order: 0
      };
      sections.push(currentSection);
    }
  }
  
  return sections;
}
