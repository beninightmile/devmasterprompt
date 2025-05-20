
import { DetectedSection } from '../types';

/**
 * Parser for specifically handling mixed formats in the same document
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
