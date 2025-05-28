
import { create } from 'zustand';
import { PromptTemplate } from '@/types/prompt';

interface TemplateState {
  templates: PromptTemplate[];
  addTemplate: (template: Omit<PromptTemplate, 'id' | 'createdAt' | 'updatedAt'>) => PromptTemplate;
  updateTemplate: (id: string, updates: Partial<PromptTemplate>) => void;
  deleteTemplate: (id: string) => void;
  getTemplate: (id: string) => PromptTemplate | undefined;
}

export const useTemplateStore = create<TemplateState>((set, get) => ({
  templates: [],
  
  addTemplate: (template) => {
    const newTemplate: PromptTemplate = {
      ...template,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    set((state) => ({
      templates: [...state.templates, newTemplate],
    }));
    
    return newTemplate;
  },
  
  updateTemplate: (id, updates) => {
    set((state) => ({
      templates: state.templates.map((template) =>
        template.id === id
          ? { ...template, ...updates, updatedAt: new Date() }
          : template
      ),
    }));
  },
  
  deleteTemplate: (id) => {
    set((state) => ({
      templates: state.templates.filter((template) => template.id !== id),
    }));
  },
  
  getTemplate: (id) => {
    return get().templates.find((template) => template.id === id);
  },
}));
