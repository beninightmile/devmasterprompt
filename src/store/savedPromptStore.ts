
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PromptSection } from '../types/prompt';

export interface SavedPrompt {
  id: string;
  name: string;
  description?: string;
  sections: PromptSection[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  totalTokens?: number;
}

interface SavedPromptState {
  savedPrompts: SavedPrompt[];
  
  // Actions
  savePrompt: (prompt: Omit<SavedPrompt, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updatePrompt: (id: string, updates: Partial<Omit<SavedPrompt, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deletePrompt: (id: string) => void;
  getPromptById: (id: string) => SavedPrompt | undefined;
}

export const useSavedPromptStore = create<SavedPromptState>()(
  persist(
    (set, get) => ({
      savedPrompts: [],
      
      savePrompt: (prompt) => {
        const id = crypto.randomUUID();
        const now = new Date();
        
        const newPrompt: SavedPrompt = {
          ...prompt,
          id,
          createdAt: now,
          updatedAt: now,
        };
        
        set(state => ({
          savedPrompts: [...state.savedPrompts, newPrompt]
        }));
        
        return id;
      },
      
      updatePrompt: (id, updates) => set(state => ({
        savedPrompts: state.savedPrompts.map(prompt => 
          prompt.id === id 
            ? { 
                ...prompt, 
                ...updates, 
                updatedAt: new Date() 
              } 
            : prompt
        )
      })),
      
      deletePrompt: (id) => set(state => ({
        savedPrompts: state.savedPrompts.filter(prompt => prompt.id !== id)
      })),
      
      getPromptById: (id) => {
        return get().savedPrompts.find(prompt => prompt.id === id);
      },
    }),
    {
      name: 'saved-prompt-store',
    }
  )
);
