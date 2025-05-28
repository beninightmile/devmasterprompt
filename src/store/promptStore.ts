
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PromptSection, InspirationItem, IdeaNote, TodoItem } from '../types/prompt';
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
  ideas: IdeaNote[];
  
  // Actions
  addSection: (section: Omit<PromptSection, 'order'>, areaId?: string) => void;
  addArea: (area: Omit<PromptSection, 'order' | 'isArea'>) => void;
  updateSection: (id: string, updates: Partial<PromptSection>) => void;
  removeSection: (id: string) => void;
  reorderSections: (orderedIds: string[]) => void;
  moveSectionToArea: (sectionId: string, targetAreaId?: string) => void;
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
  
  // Ideas actions
  addIdea: (content: string) => void;
  updateIdea: (id: string, updates: Partial<IdeaNote>) => void;
  removeIdea: (id: string) => void;
  addTodoToIdea: (ideaId: string, text: string) => void;
  updateTodo: (ideaId: string, todoId: string, updates: Partial<TodoItem>) => void;
  removeTodo: (ideaId: string, todoId: string) => void;
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
      ideas: [],
      
      // Spread all actions from createPromptActions
      ...createPromptActions(set, get),
      
      // Implementation of moveSectionToArea
      moveSectionToArea: (sectionId: string, targetAreaId?: string) => {
        set(state => ({
          sections: state.sections.map(section => 
            section.id === sectionId 
              ? { ...section, parentId: targetAreaId }
              : section
          ),
        }));
      },

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
      
      // Ideas actions
      addIdea: (content) => set(state => ({
        ideas: [...state.ideas, {
          id: crypto.randomUUID(),
          content,
          todos: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }]
      })),
      
      updateIdea: (id, updates) => set(state => ({
        ideas: state.ideas.map(idea => 
          idea.id === id ? { ...idea, ...updates, updatedAt: new Date() } : idea
        )
      })),
      
      removeIdea: (id) => set(state => ({
        ideas: state.ideas.filter(idea => idea.id !== id)
      })),
      
      addTodoToIdea: (ideaId, text) => set(state => ({
        ideas: state.ideas.map(idea => 
          idea.id === ideaId ? {
            ...idea,
            todos: [...idea.todos, {
              id: crypto.randomUUID(),
              text,
              completed: false,
              createdAt: new Date()
            }],
            updatedAt: new Date()
          } : idea
        )
      })),
      
      updateTodo: (ideaId, todoId, updates) => set(state => ({
        ideas: state.ideas.map(idea => 
          idea.id === ideaId ? {
            ...idea,
            todos: idea.todos.map(todo => 
              todo.id === todoId ? { ...todo, ...updates } : todo
            ),
            updatedAt: new Date()
          } : idea
        )
      })),
      
      removeTodo: (ideaId, todoId) => set(state => ({
        ideas: state.ideas.map(idea => 
          idea.id === ideaId ? {
            ...idea,
            todos: idea.todos.filter(todo => todo.id !== todoId),
            updatedAt: new Date()
          } : idea
        )
      })),
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
