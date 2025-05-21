import { PromptSection } from '@/types/prompt';
import { defaultPromptSections } from '@/core/registry';

// Interface for the detected sections before mapping to PromptSection
interface DetectedSection {
  name: string;
  content: string;
}

/**
 * Parse text input into sections based on various formatting patterns
 * @param text The text to parse into sections
 * @returns Array of detected sections with name and content
 */
export const parseTextIntoSections = (text: string): DetectedSection[] => {
  if (!text || text.trim().length === 0) {
    return [];
  }

  // Try to detect sections using various patterns
  const sections: DetectedSection[] = [];
  
  // Simple implementation - split by double newlines and use first line as title
  const blocks = text.split(/\n{2,}/);
  
  blocks.forEach(block => {
    const trimmedBlock = block.trim();
    if (trimmedBlock.length === 0) return;
    
    const lines = trimmedBlock.split('\n');
    let name = lines[0].trim();
    let content = lines.slice(1).join('\n').trim();
    
    // If first line looks like a title (ends with :)
    if (name.endsWith(':')) {
      name = name.slice(0, -1).trim();
    } 
    // If no natural title is found, create a generic one
    else if (lines.length === 1 || !name) {
      name = `Section ${sections.length + 1}`;
      content = trimmedBlock;
    }
    
    sections.push({ name, content });
  });
  
  return sections;
};

/**
 * Match detected sections with default sections
 * @param detectedSections The detected sections from text parsing
 * @returns Array of PromptSections ready to be added to the store
 */
export const matchWithDefaultSections = (detectedSections: DetectedSection[]): PromptSection[] => {
  // Get default sections for matching
  const defaultSections = defaultPromptSections;
  
  return detectedSections.map(section => {
    // Try to find a matching default section by name similarity
    const defaultSection = defaultSections.find(def => 
      def.name.toLowerCase().includes(section.name.toLowerCase()) || 
      section.name.toLowerCase().includes(def.name.toLowerCase())
    );
    
    // If a match is found, use the default section's ID and required status
    if (defaultSection) {
      return {
        id: defaultSection.id,
        name: section.name,
        content: section.content,
        isRequired: defaultSection.required,
        order: defaultSection.order
      };
    }
    
    // Otherwise create a new custom section
    return {
      id: crypto.randomUUID(),
      name: section.name,
      content: section.content,
      isRequired: false,
      order: 1000 + Math.floor(Math.random() * 1000) // High order number to place at end
    };
  });
};
