import { DetectedSection } from '../types';

/**
 * Parse sections with special prefixes like "@@Core_1: Section Name" or "@Standard_1: Section Name"
 * Enhanced to better support block-style prefixed sections and area recognition
 * Prioritizes German @@Core_ and @@Standard_ sections
 */
export function parsePrefixedSections(text: string): DetectedSection[] {
  const sections: DetectedSection[] = [];
  const lines = text.split('\n');
  let currentSection: DetectedSection | null = null;
  
  // Enhanced regex for prefixed section headers
  // Supports @@Core_, @@Standard_, and other @ prefixes
  const prefixedHeaderRegex = /^(@@|@)([A-Za-z0-9_\-]+)(?:\s*[:\.]|\s+[:\.])\s*(.+)$/i;
  
  // Special handling for standard sections without prefixes
  const standardSectionRegex = /^(Projektname|Beschreibung|Ziel|Zielsetzung)\s*[:\.]?\s*(.*)$/i;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const headerMatch = line.match(prefixedHeaderRegex);
    const standardMatch = line.match(standardSectionRegex);
    
    if (headerMatch) {
      // We found a prefixed heading (@@Core_1:, @Standard_1:, etc.)
      if (currentSection && currentSection.content.trim()) {
        sections.push(currentSection);
      }
      
      const prefix = headerMatch[1]; // @@ or @
      const identifier = headerMatch[2]; // Core_1, Standard_1, etc
      const title = headerMatch[3].trim();
      const fullPrefix = `${prefix}${identifier}`;
      const isArea = prefix === '@@' && identifier.startsWith('Core_');
      const isStandard = prefix === '@@' && identifier.startsWith('Standard_');
      
      // Determine level based on prefix type
      let level = 1; // Default level
      let order = 0;
      
      if (isStandard) {
        // Standard sections come first (order 1-10)
        const levelMatch = identifier.match(/_(\d+)/);
        if (levelMatch) {
          order = parseInt(levelMatch[1], 10);
        }
        level = 1;
      } else if (isArea) {
        // Core areas come after standard sections (order 10+)
        const levelMatch = identifier.match(/_(\d+)/);
        if (levelMatch) {
          order = parseInt(levelMatch[1], 10) * 10; // 10, 20, 30, etc.
        }
        level = 1;
      } else {
        // Other prefixed sections
        level = 2;
        order = 1000; // Lower priority
      }
      
      // Start a new section
      const newSection: DetectedSection = {
        id: crypto.randomUUID(),
        name: title,
        content: '',
        level: level,
        blockPrefix: fullPrefix,
        isArea: isArea,
        order: order
      };
      
      currentSection = newSection;
    } else if (standardMatch) {
      // We found a standard section without prefix (Projektname:, Beschreibung:, etc.)
      if (currentSection && currentSection.content.trim()) {
        sections.push(currentSection);
      }
      
      const sectionName = standardMatch[1];
      const initialContent = standardMatch[2] || '';
      
      // Map German section names to standard order
      const standardOrder: Record<string, number> = {
        'Projektname': 1,
        'Beschreibung': 2,
        'Ziel': 3,
        'Zielsetzung': 3 // Alias for Ziel
      };
      
      const newSection: DetectedSection = {
        id: crypto.randomUUID(),
        name: sectionName,
        content: initialContent + '\n',
        level: 1,
        order: standardOrder[sectionName] || 0,
        isArea: false
      };
      
      currentSection = newSection;
    } else if (currentSection) {
      // Add this line to the current section's content
      currentSection.content += line + '\n';
    } else if (line.trim()) {
      // Text before any heading becomes "Unsorted Content" section
      currentSection = {
        id: crypto.randomUUID(),
        name: 'Unsorted Content',
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
  
  // Sort sections by order to ensure proper hierarchy
  return sections.sort((a, b) => (a.order || 0) - (b.order || 0));
}
