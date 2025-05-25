
import type { PromptSection } from '../types/prompt';
import { STANDARD_SECTIONS, DEFAULT_AREAS } from '../services/prompt-parser/constants';

// Helper to get all areas
const getAreas = (sections: PromptSection[]) => 
  sections.filter(section => section.isArea);

// Helper to get the next order for a given level
const getNextOrder = (sections: PromptSection[], level: number, parentId?: string) => {
  const relevantSections = parentId 
    ? sections.filter(s => s.parentId === parentId)
    : sections.filter(s => s.level === level && !s.parentId);
  
  return Math.max(0, ...relevantSections.map(s => s.order)) + 1;
};

export const createPromptActions = (set: any, get: any) => ({
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

  addArea: (area: Omit<PromptSection, 'order' | 'isArea'>) => set((state: any) => {
    const maxAreaOrder = Math.max(0, ...getAreas(state.sections).map(s => s.order));
    const newArea = { 
      ...area, 
      order: maxAreaOrder + 100,
      isArea: true,
      level: 1
    };
    
    // Create a default child section for this area
    const childSection = {
      id: crypto.randomUUID(),
      name: `${area.name} - Sektion`,
      content: '',
      order: 1,
      isRequired: false,
      level: 2,
      parentId: newArea.id
    };
    
    return { sections: [...state.sections, newArea, childSection] };
  }),
  
  addSection: (section: Omit<PromptSection, 'order'>, parentId?: string) => set((state: any) => {
    let newSection: PromptSection;
    
    if (parentId) {
      // Adding a section to an area
      const area = state.sections.find((s: PromptSection) => s.id === parentId);
      if (!area) return state;
      
      const nextOrder = getNextOrder(state.sections, 2, parentId);
      
      newSection = { 
        ...section, 
        order: nextOrder,
        level: 2,
        parentId
      };
    } else {
      // Adding an independent section
      const nextOrder = getNextOrder(state.sections, section.level || 1);
      
      newSection = { 
        ...section, 
        order: nextOrder,
        level: section.level || 1
      };
    }
    
    return { sections: [...state.sections, newSection] };
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

  // Enhanced reorder function that supports cross-area movement
  reorderSections: (newOrder: string[]) => set((state: any) => {
    const sectionsMap = new Map(state.sections.map((s: PromptSection) => [s.id, s]));
    const reorderedSections: PromptSection[] = [];
    
    newOrder.forEach((id, index) => {
      const section = sectionsMap.get(id);
      if (section) {
        reorderedSections.push({
          ...section,
          order: index + 1
        });
      }
    });
    
    // Add any sections that weren't in the reorder list
    state.sections.forEach((section: PromptSection) => {
      if (!newOrder.includes(section.id)) {
        reorderedSections.push(section);
      }
    });
    
    return { sections: reorderedSections };
  }),

  // Move section to different area or make independent
  moveSectionToArea: (sectionId: string, targetAreaId?: string) => set((state: any) => {
    const updatedSections = state.sections.map((section: PromptSection) => {
      if (section.id === sectionId) {
        if (targetAreaId) {
          // Moving to an area
          const nextOrder = getNextOrder(state.sections, 2, targetAreaId);
          return {
            ...section,
            parentId: targetAreaId,
            level: 2,
            order: nextOrder
          };
        } else {
          // Making independent
          const nextOrder = getNextOrder(state.sections, 1);
          return {
            ...section,
            parentId: undefined,
            level: 1,
            order: nextOrder
          };
        }
      }
      return section;
    });
    
    return { sections: updatedSections };
  }),

  resetToDefault: () => {
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
    
    set({ 
      sections,
      templateName: '',
      currentTemplateId: null,
    });
  },
  
  clearAll: () => {
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
    
    set({ 
      sections,
      inspirationItems: [],
      templateName: '',
      currentTemplateId: null,
    });
  },
});
