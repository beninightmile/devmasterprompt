
import { StoreApi } from 'zustand';
import { PromptStoreState } from '../promptStore';
import { PromptSection } from '@/types/prompt';

export const sectionActions = (set: StoreApi<PromptStoreState>['setState']) => ({
  addSection: (section: Omit<PromptSection, 'order'>) => {
    set((state) => {
      const newSection: PromptSection = {
        ...section,
        order: state.sections.length,
        level: section.level ?? 1,
        parentId: section.parentId || undefined,
        isArea: section.isArea ?? false,
      };
      return {
        sections: [...state.sections, newSection],
      };
    });
  },

  updateSection: (id: string, updates: Partial<PromptSection>) => {
    set((state) => ({
      sections: state.sections.map(section =>
        section.id === id ? { ...section, ...updates } : section
      ),
    }));
  },

  removeSection: (id: string) => {
    set((state) => ({
      sections: state.sections.filter(section => section.id !== id),
      activeSectionId: state.activeSectionId === id ? null : state.activeSectionId,
    }));
  },

  reorderSections: (sectionIds: string[]) => {
    set((state) => {
      const reorderedSections = sectionIds.map((id, index) => {
        const section = state.sections.find(s => s.id === id);
        return section ? { ...section, order: index } : null;
      }).filter((section): section is PromptSection => section !== null);

      return {
        sections: reorderedSections,
      };
    });
  },
});
