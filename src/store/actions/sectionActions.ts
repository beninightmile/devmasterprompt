
import type { PromptSection } from '../../types/prompt';
import { getNextOrder } from '../utils/sectionUtils';

export const createSectionActions = (set: any, get: any) => ({
  addArea: (area: Omit<PromptSection, 'order' | 'isArea'>) => set((state: any) => {
    const areas = state.sections.filter((section: PromptSection) => section.isArea);
    const maxAreaOrder = Math.max(0, ...areas.map(s => s.order));
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
});
