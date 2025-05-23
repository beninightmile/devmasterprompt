import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PromptSection, InspirationItem } from '../types/prompt';
import { createPromptActions } from './promptActions';

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
      
      // Spread the actions
      ...createPromptActions(set, get),
      
      updateSection: (id, updates) => set(state => ({
        sections: state.sections.map(section => 
          section.id === id ? { ...section, ...updates } : section
        ),
      })),
      
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
