
import { DetectedSection } from '../types';

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
