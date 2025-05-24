
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
  
  // Enhanced mapping for German sections
  const germanSectionMapping: Record<string, { name: string, order: number }> = {
    'projektname': { name: 'Projektname', order: 1 },
    'kurzbeschreibung': { name: 'Beschreibung', order: 2 },
    'beschreibung': { name: 'Beschreibung', order: 2 },
    'zielsetzung und unveränderliche regeln': { name: 'Zielsetzung und unveränderliche Regeln', order: 3 },
    'ziel': { name: 'Zielsetzung und unveränderliche Regeln', order: 3 },
    'zielsetzung': { name: 'Zielsetzung und unveränderliche Regeln', order: 3 },
    'referenz ui': { name: 'Referenz UI', order: 4 },
  };
  
  // Special handling for standard sections without prefixes
  const standardSectionRegex = /^(Projektname|Kurzbeschreibung|Beschreibung|Ziel|Zielsetzung|Zielsetzung und unveränderliche Regeln|Referenz UI)\s*[:\.]?\s*(.*)$/i;
  
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
      
      // Check if this is a German section that needs mapping
      const lowerTitle = title.toLowerCase();
      const mappedSection = germanSectionMapping[lowerTitle];
      const finalName = mappedSection ? mappedSection.name : title;
      
      // Determine level based on prefix type
      let level = 1; // Default level
      let order = 0;
      
      if (isStandard) {
        // Standard sections come first (order 1-10)
        const levelMatch = identifier.match(/_(\d+)/);
        if (levelMatch) {
          order = parseInt(levelMatch[1], 10);
        }
        if (mappedSection) {
          order = mappedSection.order;
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
        name: finalName,
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
      
      // Apply German section mapping
      const lowerName = sectionName.toLowerCase();
      const mappedSection = germanSectionMapping[lowerName];
      const finalName = mappedSection ? mappedSection.name : sectionName;
      const finalOrder = mappedSection ? mappedSection.order : 0;
      
      const newSection: DetectedSection = {
        id: crypto.randomUUID(),
        name: finalName,
        content: initialContent + '\n',
        level: 1,
        order: finalOrder,
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
