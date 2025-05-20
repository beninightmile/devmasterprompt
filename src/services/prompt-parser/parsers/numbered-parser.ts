
import { DetectedSection } from '../types';

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
