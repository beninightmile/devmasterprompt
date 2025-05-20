
import { DetectedSection } from '../types';

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
