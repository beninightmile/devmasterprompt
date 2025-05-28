
import { useTemplateStore } from '@/store/templateStore';
import { usePromptStore } from '@/store/promptStore';
import { PromptTemplate } from '@/types/prompt';

export const saveCurrentPromptAsTemplate = (
  name: string, 
  description: string = '', 
  tags: string[] = []
): PromptTemplate => {
  const { sections, templateName } = usePromptStore.getState();
  const { addTemplate } = useTemplateStore.getState();
  
  const template = addTemplate({
    name: name || templateName || 'Untitled Template',
    description,
    sections: [...sections],
    tags,
  });
  
  return template;
};

export const loadTemplateIntoPrompt = (templateId: string): boolean => {
  const { getTemplate } = useTemplateStore.getState();
  const { 
    clearAll, 
    addSection, 
    setTemplateName, 
    setCurrentTemplateId 
  } = usePromptStore.getState();
  
  const template = getTemplate(templateId);
  if (!template) {
    return false;
  }
  
  // Clear existing sections
  clearAll();
  
  // Add template sections
  template.sections.forEach(section => {
    addSection({
      id: section.id,
      name: section.name,
      content: section.content,
      isRequired: section.isRequired,
      level: section.level,
      parentId: section.parentId,
      isArea: section.isArea
    });
  });
  
  // Set template metadata
  setTemplateName(template.name);
  setCurrentTemplateId(template.id);
  
  return true;
};

export const autoSaveTemplate = (): string | null => {
  const { templateName, sections, currentTemplateId } = usePromptStore.getState();
  const { addTemplate, updateTemplate, getTemplate } = useTemplateStore.getState();
  
  if (!templateName.trim()) {
    return null;
  }
  
  if (currentTemplateId) {
    // Update existing template
    const existing = getTemplate(currentTemplateId);
    if (existing) {
      updateTemplate(currentTemplateId, {
        sections: [...sections],
        updatedAt: new Date(),
      });
      return currentTemplateId;
    }
  }
  
  // Create new template
  const template = addTemplate({
    name: templateName,
    description: '',
    sections: [...sections],
    tags: [],
  });
  
  // Update current template ID
  usePromptStore.getState().setCurrentTemplateId(template.id);
  
  return template.id;
};

export const getPopularTags = (templates: PromptTemplate[]): string[] => {
  const tagCounts: { [key: string]: number } = {};
  
  templates.forEach(template => {
    template.tags?.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  
  return Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([tag]) => tag);
};
