
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { defaultPromptSections } from '../core/registry';
import type { PromptSection, InspirationItem } from '../types/prompt';

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
  addSection: (section: Omit<PromptSection, 'order'>) => void;
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
}

// Initialize with default sections
const initialSections: PromptSection[] = defaultPromptSections.map(section => ({
  id: section.id,
  name: section.name,
  content: section.defaultContent,
  order: section.order,
  isRequired: section.required,
}));

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
      
      addSection: (section) => set(state => {
        const maxOrder = Math.max(0, ...state.sections.map(s => s.order));
        const newSection = { ...section, order: maxOrder + 1 };
        return { sections: [...state.sections, newSection] };
      }),
      
      updateSection: (id, updates) => set(state => ({
        sections: state.sections.map(section => 
          section.id === id ? { ...section, ...updates } : section
        ),
      })),
      
      removeSection: (id) => set(state => ({
        sections: state.sections.filter(section => section.id !== id),
        activeSectionId: state.activeSectionId === id 
          ? (state.sections.length > 1 ? state.sections[0].id : null) 
          : state.activeSectionId,
      })),
      
      reorderSections: (orderedIds) => set(state => {
        const orderedSections = orderedIds
          .map((id, idx) => {
            const section = state.sections.find(s => s.id === id);
            return section ? { ...section, order: idx } : null;
          })
          .filter(Boolean) as PromptSection[];
        
        return { sections: orderedSections };
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
      
      resetToDefault: () => set({ 
        sections: initialSections,
        templateName: '',
        currentTemplateId: null,
      }),
      
      clearAll: () => set({ 
        sections: initialSections.filter(section => section.isRequired),
        inspirationItems: [],
        templateName: '',
        currentTemplateId: null,
      }),
    }),
    {
      name: 'prompt-store',
    }
  )
);
