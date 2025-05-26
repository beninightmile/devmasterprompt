
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PromptSection } from '../types/prompt';

export interface PromptTemplate {
  id: string;
  name: string;
  description?: string;
  sections: PromptSection[]; // Ohne Inhalt, nur Struktur
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  complexity: 'low' | 'medium' | 'high' | 'enterprise';
  estimatedTime: string;
}

interface PromptTemplateState {
  promptTemplates: PromptTemplate[];
  
  // Actions
  saveTemplate: (template: Omit<PromptTemplate, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateTemplate: (id: string, updates: Partial<Omit<PromptTemplate, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteTemplate: (id: string) => void;
  getTemplateById: (id: string) => PromptTemplate | undefined;
}

export const usePromptTemplateStore = create<PromptTemplateState>()(
  persist(
    (set, get) => ({
      promptTemplates: [],
      
      saveTemplate: (template) => {
        const id = crypto.randomUUID();
        const now = new Date();
        
        // Entferne Inhalt aus Sektionen für Template
        const sectionsWithoutContent = template.sections.map(section => ({
          ...section,
          content: '' // Template hat keine Inhalte
        }));
        
        const newTemplate: PromptTemplate = {
          ...template,
          sections: sectionsWithoutContent,
          id,
          createdAt: now,
          updatedAt: now,
        };
        
        set(state => ({
          promptTemplates: [...state.promptTemplates, newTemplate]
        }));
        
        return id;
      },
      
      updateTemplate: (id, updates) => set(state => ({
        promptTemplates: state.promptTemplates.map(template => 
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
        promptTemplates: state.promptTemplates.filter(template => template.id !== id)
      })),
      
      getTemplateById: (id) => {
        return get().promptTemplates.find(template => template.id === id);
      },
    }),
    {
      name: 'prompt-template-store',
    }
  )
);
