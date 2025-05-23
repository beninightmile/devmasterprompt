
import type { PromptSection } from '../types/prompt';
import { createDefaultAreas, createDefaultSectionForArea } from '../services/prompt-parser';

// Helper to get all areas
const getAreas = (sections: PromptSection[]) => 
  sections.filter(section => section.isArea);

export const createPromptActions = (set: any, get: any) => ({
  initializeDefaultAreas: () => set((state: any) => {
    if (state.sections.length === 0) {
      const areas = createDefaultAreas();
      
      // Create a default section for each area
      const sectionsWithChildren = areas.flatMap(area => {
        const childSection = createDefaultSectionForArea(area.id, area.name);
        return [area, childSection];
      });
      
      return { sections: sectionsWithChildren };
    }
    return {};
  }),

  addArea: (area: Omit<PromptSection, 'order' | 'isArea'>) => set((state: any) => {
    const maxAreaOrder = Math.max(0, ...getAreas(state.sections).map(s => s.order));
    const newArea = { 
      ...area, 
      order: maxAreaOrder + 10, // Increment by 10 to leave space
      isArea: true,
      level: 1
    };
    
    // Create a default child section for this area
    const childSection = {
      id: crypto.randomUUID(),
      name: `${area.name} - Sektion`,
      content: '',
      order: maxAreaOrder + 11,
      isRequired: false,
      level: 2,
      parentId: newArea.id
    };
    
    return { sections: [...state.sections, newArea, childSection] };
  }),
  
  addSection: (section: Omit<PromptSection, 'order'>, areaId?: string) => set((state: any) => {
    // If areaId is provided, we're adding a section to an area
    if (areaId) {
      const area = state.sections.find((s: PromptSection) => s.id === areaId);
      if (!area) return state; // If area doesn't exist, do nothing
      
      const areaSections = state.sections.filter((s: PromptSection) => s.parentId === areaId);
      const maxOrder = Math.max(0, ...areaSections.map(s => s.order));
      
      const newSection = { 
        ...section, 
        order: maxOrder + 1,
        level: 2,
        parentId: areaId
      };
      
      return { sections: [...state.sections, newSection] };
    } else {
      // Add as a regular section (not under any area)
      const maxOrder = Math.max(0, ...state.sections.map((s: PromptSection) => s.order));
      const newSection = { 
        ...section, 
        order: maxOrder + 1,
        level: section.level || 1
      };
      
      return { sections: [...state.sections, newSection] };
    }
  }),
  
  removeSection: (id: string) => set((state: any) => {
    const sectionToRemove = state.sections.find((s: PromptSection) => s.id === id);
    
    if (!sectionToRemove) return state;
    
    // If it's an area, remove all child sections too
    if (sectionToRemove.isArea) {
      const remainingSections = state.sections.filter((section: PromptSection) => {
        return section.id !== id && section.parentId !== id;
      });
      
      return {
        sections: remainingSections,
        activeSectionId: state.activeSectionId === id || state.sections.some((s: PromptSection) => s.parentId === id && s.id === state.activeSectionId)
          ? (remainingSections.length > 0 ? remainingSections[0].id : null) 
          : state.activeSectionId,
      };
    }
    
    // If it's a regular section
    const remainingSections = state.sections.filter((section: PromptSection) => section.id !== id);
    
    // If this is the last child of an area, don't allow deletion
    if (sectionToRemove.parentId) {
      const siblingCount = state.sections.filter((s: PromptSection) => s.parentId === sectionToRemove.parentId).length;
      if (siblingCount <= 1) {
        // Don't delete the last child section
        return state;
      }
    }
    
    return {
      sections: remainingSections,
      activeSectionId: state.activeSectionId === id 
        ? (remainingSections.length > 0 ? remainingSections[0].id : null) 
        : state.activeSectionId,
    };
  }),

  resetToDefault: () => {
    const defaultAreas = createDefaultAreas();
    const defaultSections = defaultAreas.flatMap(area => {
      const childSection = createDefaultSectionForArea(area.id, area.name);
      return [area, childSection];
    });
    
    set({ 
      sections: defaultSections,
      templateName: '',
      currentTemplateId: null,
    });
  },
  
  clearAll: () => {
    const defaultAreas = createDefaultAreas();
    const defaultSections = defaultAreas.flatMap(area => {
      const childSection = createDefaultSectionForArea(area.id, area.name);
      return [area, childSection];
    });
    
    set({ 
      sections: defaultSections,
      inspirationItems: [],
      templateName: '',
      currentTemplateId: null,
    });
  },
});
