
import type { PromptSection } from '../../types/prompt';

export const createReorderActions = (set: any) => ({
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
});
