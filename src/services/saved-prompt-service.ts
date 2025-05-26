
import type { SavedPrompt } from '@/store/savedPromptStore';
import type { PromptTemplate } from '@/store/promptTemplateStore';
import { useSavedPromptStore } from '@/store/savedPromptStore';
import { usePromptTemplateStore } from '@/store/promptTemplateStore';
import { usePromptStore } from '@/store/promptStore';
import { estimatePromptTokens, generatePromptText } from './prompt-service';

export function saveCurrentAsPrompt(name: string, description?: string, tags?: string[]): string {
  const { sections } = usePromptStore.getState();
  const { savePrompt } = useSavedPromptStore.getState();
  
  // Speichere alle Sektionen mit vollem Inhalt
  const promptText = generatePromptText(sections);
  const totalTokens = estimatePromptTokens(promptText);
  
  return savePrompt({
    name,
    description,
    sections,
    tags,
    totalTokens,
  });
}

export function saveCurrentAsTemplate(
  name: string, 
  description?: string, 
  tags?: string[],
  complexity: 'low' | 'medium' | 'high' | 'enterprise' = 'low',
  estimatedTime: string = '1-2 Stunden'
): string {
  const { sections } = usePromptStore.getState();
  const { saveTemplate } = usePromptTemplateStore.getState();
  
  // Filtere nur nicht-leere Sektionen für Template-Struktur
  const structureSections = sections.filter(section => 
    section.isRequired || section.name.trim() !== ''
  );
  
  return saveTemplate({
    name,
    description,
    sections: structureSections,
    tags,
    complexity,
    estimatedTime,
  });
}

export function loadSavedPrompt(promptId: string): boolean {
  const { savedPrompts } = useSavedPromptStore.getState();
  const { 
    updateSection, 
    addSection, 
    removeSection, 
    sections, 
    setTemplateName, 
    setCurrentTemplateId 
  } = usePromptStore.getState();
  
  const prompt = savedPrompts.find(p => p.id === promptId);
  
  if (!prompt) {
    return false;
  }
  
  // Setze den Prompt Namen
  setTemplateName(prompt.name);
  setCurrentTemplateId(promptId);
  
  // Lade vollständigen Inhalt
  const existingIds = sections.map(s => s.id);
  const promptIds = prompt.sections.map(s => s.id);
  
  // Entferne Sektionen die nicht im Prompt sind
  sections.forEach(section => {
    if (!promptIds.includes(section.id) && !section.isRequired) {
      removeSection(section.id);
    }
  });
  
  // Lade Sektionen mit vollem Inhalt
  prompt.sections.forEach(section => {
    if (existingIds.includes(section.id)) {
      updateSection(section.id, {
        name: section.name,
        content: section.content,
        order: section.order
      });
    } else {
      addSection({
        id: section.id,
        name: section.name,
        content: section.content,
        isRequired: section.isRequired,
        level: section.level,
        parentId: section.parentId,
        isArea: section.isArea
      });
    }
  });
  
  return true;
}

export function loadPromptTemplate(templateId: string): boolean {
  const { promptTemplates } = usePromptTemplateStore.getState();
  const { 
    updateSection, 
    addSection, 
    removeSection, 
    sections, 
    setTemplateName, 
    setCurrentTemplateId 
  } = usePromptStore.getState();
  
  const template = promptTemplates.find(t => t.id === templateId);
  
  if (!template) {
    return false;
  }
  
  // Setze den Template Namen
  setTemplateName(template.name);
  setCurrentTemplateId(null); // Templates haben keine ID im Prompt Store
  
  // Lade nur Struktur (ohne Inhalt)
  const existingIds = sections.map(s => s.id);
  const templateIds = template.sections.map(s => s.id);
  
  // Entferne Sektionen die nicht im Template sind
  sections.forEach(section => {
    if (!templateIds.includes(section.id) && !section.isRequired) {
      removeSection(section.id);
    }
  });
  
  // Lade Template-Sektionen ohne Inhalt
  template.sections.forEach(section => {
    if (existingIds.includes(section.id)) {
      updateSection(section.id, {
        name: section.name,
        content: '', // Templates haben keinen Inhalt
        order: section.order
      });
    } else {
      addSection({
        id: crypto.randomUUID(), // Neue ID für neue Session
        name: section.name,
        content: '', // Leerer Inhalt
        isRequired: section.isRequired,
        level: section.level,
        parentId: section.parentId,
        isArea: section.isArea
      });
    }
  });
  
  return true;
}
