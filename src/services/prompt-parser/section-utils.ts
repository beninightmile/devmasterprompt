
import { DetectedSection } from './types';
import { PromptSection } from '@/types/prompt';

/**
 * Clean up a section name by removing common prefixes and formatting
 */
export function cleanupSectionName(name: string): string {
  // Remove numbering like "1.", "1.1.", etc.
  let cleaned = name.replace(/^\d+(\.\d+)*\.?\s+/g, '');
  
  // Remove special prefixes like "@Core_1:"
  cleaned = cleaned.replace(/^@[A-Za-z0-9_\-]+:\s*/i, '');
  
  // If only whitespace remains, return the original
  if (!cleaned.trim()) {
    return name;
  }
  
  return cleaned.trim();
}

/**
 * Merge newly uploaded sections with existing ones
 */
export function mergeSections(existingSections: PromptSection[], newSections: DetectedSection[]): PromptSection[] {
  const existingNames = new Set(existingSections.map(s => s.name.toLowerCase()));
  const result: PromptSection[] = [...existingSections];
  
  // Find the highest order value in existing sections
  const maxOrder = Math.max(...existingSections.map(s => s.order), 0);
  let orderCounter = maxOrder + 1;
  
  // Add new sections that don't exist yet
  newSections.forEach(newSection => {
    const cleanName = cleanupSectionName(newSection.name);
    const normalizedName = cleanName.toLowerCase();
    
    if (!existingNames.has(normalizedName)) {
      result.push({
        id: crypto.randomUUID(),
        name: cleanName,
        content: newSection.content,
        order: orderCounter++,
        isRequired: false
      });
    } else {
      // Update existing section with the same name if it's empty
      const existingSection = result.find(s => s.name.toLowerCase() === normalizedName);
      if (existingSection && existingSection.content.trim() === '') {
        existingSection.content = newSection.content;
      }
    }
  });
  
  return result;
}
