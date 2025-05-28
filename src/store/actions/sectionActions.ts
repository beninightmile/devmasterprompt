
import { StoreApi } from 'zustand';
import { PromptSection } from '@/types/prompt';

export interface PromptStoreState {
  sections: PromptSection[];
  activeSectionId: string | null;
}

export const sectionActions = (set: StoreApi<PromptStoreState>['setState']) => ({
  addSection: (section: Omit<PromptSection, 'order'>, areaId?: string) => {
    set((state: PromptStoreState) => {
      const newSection: PromptSection = {
        ...section,
        order: state.sections.length,
        level: section.level ?? 1,
        parentId: areaId || section.parentId || undefined,
        isArea: section.isArea ?? false,
      };
      return {
        sections: [...state.sections, newSection],
      };
    });
  },

  addArea: (area: Omit<PromptSection, 'order' | 'isArea'>) => {
    set((state: PromptStoreState) => {
      const newArea: PromptSection = {
        ...area,
        order: state.sections.length,
        level: area.level ?? 1,
        parentId: area.parentId || undefined,
        isArea: true,
      };
      return {
        sections: [...state.sections, newArea],
      };
    });
  },

  updateSection: (id: string, updates: Partial<PromptSection>) => {
    set((state: PromptStoreState) => ({
      sections: state.sections.map((section: PromptSection) =>
        section.id === id ? { ...section, ...updates } : section
      ),
    }));
  },

  removeSection: (id: string) => {
    set((state: PromptStoreState) => ({
      sections: state.sections.filter((section: PromptSection) => section.id !== id),
      activeSectionId: state.activeSectionId === id ? null : state.activeSectionId,
    }));
  },

  reorderSections: (sectionIds: string[]) => {
    set((state: PromptStoreState) => {
      const reorderedSections = sectionIds.map((id, index) => {
        const section = state.sections.find((s: PromptSection) => s.id === id);
        return section ? { ...section, order: index } : null;
      }).filter((section): section is PromptSection => section !== null);

      return {
        sections: reorderedSections,
      };
    });
  },
});

export const createSectionActions = sectionActions;
