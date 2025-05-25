
import { PromptSection } from '@/types/prompt';
import { STANDARD_SECTIONS, DEFAULT_AREAS } from './constants';

/**
 * Create default areas with their child sections
 */
export function createDefaultAreas(): PromptSection[] {
  const sections: PromptSection[] = [];
  
  // Add standard sections first
  STANDARD_SECTIONS.forEach(sectionTemplate => {
    sections.push({
      ...sectionTemplate,
      id: crypto.randomUUID(),
      content: ''
    });
  });
  
  // Add areas and their child sections
  DEFAULT_AREAS.forEach(({ area, sections: areaSections }) => {
    const areaId = crypto.randomUUID();
    
    // Add the area
    sections.push({
      ...area,
      id: areaId,
      content: ''
    });
    
    // Add child sections
    areaSections.forEach(sectionTemplate => {
      sections.push({
        ...sectionTemplate,
        id: crypto.randomUUID(),
        content: '',
        parentId: areaId
      });
    });
  });
  
  return sections;
}

/**
 * Create a default section for a given area
 */
export function createDefaultSectionForArea(areaId: string, areaName: string): PromptSection {
  return {
    id: crypto.randomUUID(),
    name: `${areaName} - Sektion`,
    content: '',
    order: 1,
    isRequired: false,
    level: 2,
    parentId: areaId
  };
}
