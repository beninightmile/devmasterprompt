
import { DetectedSection } from '../types';

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
