
import { DetectedSection } from '../types';

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
