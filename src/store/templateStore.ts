
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PromptTemplate, PromptSection } from '../types/prompt';

interface TemplateState {
  templates: PromptTemplate[];
  
  // Actions
  saveTemplate: (template: Omit<PromptTemplate, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateTemplate: (id: string, updates: Partial<Omit<PromptTemplate, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteTemplate: (id: string) => void;
  getTemplateById: (id: string) => PromptTemplate | undefined;
}

export const useTemplateStore = create<TemplateState>()(
  persist(
    (set, get) => ({
      templates: [],
      
      saveTemplate: (template) => {
        const id = crypto.randomUUID();
        const now = new Date();
        
        const newTemplate: PromptTemplate = {
          ...template,
          id,
          createdAt: now,
          updatedAt: now,
        };
        
        set(state => ({
          templates: [...state.templates, newTemplate]
        }));
        
        return id;
      },
      
      updateTemplate: (id, updates) => set(state => ({
        templates: state.templates.map(template => 
          template.id === id 
            ? { 
                ...template, 
                ...updates, 
                updatedAt: new Date() 
              } 
            : template
        )
      })),
      
      deleteTemplate: (id) => set(state => ({
        templates: state.templates.filter(template => template.id !== id)
      })),
      
      getTemplateById: (id) => {
        return get().templates.find(template => template.id === id);
      },
    }),
    {
      name: 'template-store',
    }
  )
);
