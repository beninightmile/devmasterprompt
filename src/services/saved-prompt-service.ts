
import { PromptSection } from '@/types/prompt';

export const savePrompt = (
  name: string,
  description: string | undefined,
  sections: PromptSection[],
  tags: string[] | undefined
) => {
  const savedPrompt = {
    name,
    description: description || '',
    sections,
    tags: tags || [],
    totalTokens: sections.reduce((acc, section) => acc + section.content.length, 0),
  };
  
  console.log('Saving prompt:', savedPrompt);
  return savedPrompt;
};

export const saveAsTemplate = (
  name: string,
  description: string | undefined,
  sections: PromptSection[],
  tags: string[] | undefined,
  complexity: 'low' | 'medium' | 'high' | 'enterprise',
  estimatedTime: string
) => {
  const template = {
    name,
    description: description || '',
    sections,
    tags: tags || [],
    complexity,
    estimatedTime,
  };
  
  console.log('Saving template:', template);
  return template;
};

export const convertToPromptSections = (rawSections: any[]): PromptSection[] => {
  return rawSections.map((section, index) => ({
    id: section.id || crypto.randomUUID(),
    name: section.name || `Section ${index + 1}`,
    content: section.content || '',
    order: section.order || index,
    isRequired: section.isRequired || false,
    level: section.level ?? 1,
    parentId: section.parentId || undefined,
    isArea: section.isArea ?? false,
  }));
};

export const convertFromPromptSections = (sections: PromptSection[]): any[] => {
  return sections.map(section => ({
    id: crypto.randomUUID(),
    name: section.name,
    content: section.content,
    isRequired: section.isRequired,
    level: section.level ?? 1,
    parentId: section.parentId || undefined,
    isArea: section.isArea ?? false,
  }));
};
