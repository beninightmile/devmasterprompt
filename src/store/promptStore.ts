import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { defaultPromptSections } from '../core/registry';
import type { PromptSection, InspirationItem } from '../types/prompt';
import { DEFAULT_AREAS, createDefaultAreas, createDefaultSectionForArea } from '../services/prompt-parser';

interface PromptState {
  sections: PromptSection[];
  activeSectionId: string | null;
  inspirationItems: InspirationItem[];
  isPreviewMode: boolean;
  templateName: string;
  currentTemplateId: string | null;
  autoSaveEnabled: boolean;
  autoSaveInterval: number; // in minutes
  lastSaveTime: Date | null;
  
  // Actions
  addSection: (section: Omit<PromptSection, 'order'>, areaId?: string) => void;
  addArea: (area: Omit<PromptSection, 'order' | 'isArea'>) => void;
  updateSection: (id: string, updates: Partial<PromptSection>) => void;
  removeSection: (id: string) => void;
  reorderSections: (orderedIds: string[]) => void;
  setActiveSection: (id: string | null) => void;
  addInspirationItem: (item: Omit<InspirationItem, 'id'>) => void;
  removeInspirationItem: (id: string) => void;
  setPreviewMode: (isPreview: boolean) => void;
  setTemplateName: (name: string) => void;
  setCurrentTemplateId: (id: string | null) => void;
  setAutoSaveEnabled: (enabled: boolean) => void;
  setAutoSaveInterval: (minutes: number) => void;
  updateLastSaveTime: () => void;
  resetToDefault: () => void;
  clearAll: () => void;
  initializeDefaultAreas: () => void;
}

// Initialize with default areas instead of sections
const initialSections: PromptSection[] = [];

// Helper to get all areas
const getAreas = (sections: PromptSection[]) => 
  sections.filter(section => section.isArea);

// Helper to get all non-area sections
const getNonAreas = (sections: PromptSection[]) => 
  sections.filter(section => !section.isArea);

export const usePromptStore = create<PromptState>()(
  persist(
    (set, get) => ({
      sections: initialSections,
      activeSectionId: initialSections.length > 0 ? initialSections[0].id : null,
      inspirationItems: [],
      isPreviewMode: false,
      templateName: '',
      currentTemplateId: null,
      autoSaveEnabled: false,
      autoSaveInterval: 5, // Default to 5 minutes
      lastSaveTime: null,
      
      initializeDefaultAreas: () => set(state => {
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

      addArea: (area) => set(state => {
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
      
      addSection: (section, areaId) => set(state => {
        // If areaId is provided, we're adding a section to an area
        if (areaId) {
          const area = state.sections.find(s => s.id === areaId);
          if (!area) return state; // If area doesn't exist, do nothing
          
          const areaSections = state.sections.filter(s => s.parentId === areaId);
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
          const maxOrder = Math.max(0, ...state.sections.map(s => s.order));
          const newSection = { 
            ...section, 
            order: maxOrder + 1,
            level: section.level || 1
          };
          
          return { sections: [...state.sections, newSection] };
        }
      }),
      
      updateSection: (id, updates) => set(state => ({
        sections: state.sections.map(section => 
          section.id === id ? { ...section, ...updates } : section
        ),
      })),
      
      removeSection: (id) => set(state => {
        const sectionToRemove = state.sections.find(s => s.id === id);
        
        if (!sectionToRemove) return state;
        
        // If it's an area, remove all child sections too
        if (sectionToRemove.isArea) {
          const remainingSections = state.sections.filter(section => {
            return section.id !== id && section.parentId !== id;
          });
          
          return {
            sections: remainingSections,
            activeSectionId: state.activeSectionId === id || state.sections.some(s => s.parentId === id && s.id === state.activeSectionId)
              ? (remainingSections.length > 0 ? remainingSections[0].id : null) 
              : state.activeSectionId,
          };
        }
        
        // If it's a regular section
        const remainingSections = state.sections.filter(section => section.id !== id);
        
        // If this is the last child of an area, don't allow deletion
        if (sectionToRemove.parentId) {
          const siblingCount = state.sections.filter(s => s.parentId === sectionToRemove.parentId).length;
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
      
      reorderSections: (orderedIds) => set(state => {
        const orderedSections = orderedIds
          .map((id, idx) => {
            const section = state.sections.find(s => s.id === id);
            return section ? { ...section, order: idx * 10 } : null;
          })
          .filter(Boolean) as PromptSection[];
        
        // Keep sections that weren't in the orderedIds
        const unorderedSections = state.sections.filter(
          section => !orderedIds.includes(section.id)
        );
        
        return { sections: [...orderedSections, ...unorderedSections] };
      }),
      
      setActiveSection: (id) => set({ activeSectionId: id }),
      
      addInspirationItem: (item) => set(state => ({
        inspirationItems: [...state.inspirationItems, { ...item, id: crypto.randomUUID() }],
      })),
      
      removeInspirationItem: (id) => set(state => ({
        inspirationItems: state.inspirationItems.filter(item => item.id !== id),
      })),
      
      setPreviewMode: (isPreview) => set({ isPreviewMode: isPreview }),
      
      setTemplateName: (name) => set({ templateName: name }),
      
      setCurrentTemplateId: (id) => set({ currentTemplateId: id }),
      
      setAutoSaveEnabled: (enabled) => set({ autoSaveEnabled: enabled }),
      
      setAutoSaveInterval: (minutes) => set({ 
        autoSaveInterval: Math.max(1, Math.min(60, minutes)) 
      }),
      
      updateLastSaveTime: () => set({ lastSaveTime: new Date() }),
      
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
    }),
    {
      name: 'prompt-store',
      onRehydrateStorage: () => (state) => {
        // If there are no sections after rehydration, initialize default areas
        if (state && (!state.sections || state.sections.length === 0)) {
          state.initializeDefaultAreas();
        }
      },
    }
  )
);

// Initialize default areas if store is empty
const initStore = () => {
  const { sections, initializeDefaultAreas } = usePromptStore.getState();
  if (sections.length === 0) {
    initializeDefaultAreas();
  }
};

// Call initStore when the app loads
if (typeof window !== 'undefined') {
  setTimeout(initStore, 0);
}
