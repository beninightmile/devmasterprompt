
import type { PromptSection } from '../../types/prompt';
import { STANDARD_SECTIONS, DEFAULT_AREAS } from '../../services/prompt-parser/constants';

export const createInitActions = (set: any) => ({
  initializeDefaultAreas: () => set((state: any) => {
    if (state.sections.length === 0) {
      const sections: PromptSection[] = [];
      
      // Add standard sections
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
      
      return { sections };
    }
    return {};
  }),

  resetToDefault: () => set(() => {
    const sections: PromptSection[] = [];
    
    // Add standard sections
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
      
      sections.push({
        ...area,
        id: areaId,
        content: ''
      });
      
      areaSections.forEach(sectionTemplate => {
        sections.push({
          ...sectionTemplate,
          id: crypto.randomUUID(),
          content: '',
          parentId: areaId
        });
      });
    });
    
    return { 
      sections,
      templateName: '',
      currentTemplateId: null,
    };
  }),
  
  clearAll: () => set(() => {
    const sections: PromptSection[] = [];
    
    // Add standard sections
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
      
      sections.push({
        ...area,
        id: areaId,
        content: ''
      });
      
      areaSections.forEach(sectionTemplate => {
        sections.push({
          ...sectionTemplate,
          id: crypto.randomUUID(),
          content: '',
          parentId: areaId
        });
      });
    });
    
    return { 
      sections,
      inspirationItems: [],
      templateName: '',
      currentTemplateId: null,
    };
  })
});
