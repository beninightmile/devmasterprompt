
import { StoreApi } from 'zustand';
import { PromptSection } from '@/types/prompt';
import { getNextOrder } from '../utils/sectionUtils';

export interface PromptStoreState {
  sections: PromptSection[];
  activeSectionId: string | null;
}

export const sectionActions = (set: StoreApi<PromptStoreState>['setState'], get: () => PromptStoreState) => ({
  addSection: (section: Omit<PromptSection, 'order'>, areaId?: string) => {
    set((state: PromptStoreState) => {
      const currentState = get();
      const level = section.level ?? (areaId ? 2 : 1);
      const nextOrder = getNextOrder(currentState.sections, level, areaId);
      
      const newSection: PromptSection = {
        ...section,
        order: nextOrder,
        level: level,
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
      const currentState = get();
      const level = area.level ?? 1;
      const nextOrder = getNextOrder(currentState.sections, level, area.parentId);
      
      const newArea: PromptSection = {
        ...area,
        order: nextOrder,
        level: level,
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
