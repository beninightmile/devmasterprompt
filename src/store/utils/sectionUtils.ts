
import type { PromptSection } from '../../types/prompt';

// Helper to get all areas
export const getAreas = (sections: PromptSection[]) => 
  sections.filter(section => section.isArea);

// Helper to get the next order for a given level
export const getNextOrder = (sections: PromptSection[], level: number, parentId?: string) => {
  const relevantSections = parentId 
    ? sections.filter(s => s.parentId === parentId)
    : sections.filter(s => s.level === level && !s.parentId);
  
  return Math.max(0, ...relevantSections.map(s => s.order)) + 1;
};
