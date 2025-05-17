
import type { PromptTemplate, PromptSection } from '@/types/prompt';
import { useTemplateStore } from '@/store/templateStore';
import { usePromptStore } from '@/store/promptStore';
import { estimatePromptTokens, generatePromptText } from './prompt-service';

export function saveCurrentPromptAsTemplate(name: string, description?: string, tags?: string[]): string {
  const { sections } = usePromptStore.getState();
  const { saveTemplate } = useTemplateStore.getState();
  
  // Only save non-empty sections
  const nonEmptySections = sections.filter(section => 
    section.isRequired || section.content.trim() !== ''
  );
  
  // Calculate total tokens for the template
  const promptText = generatePromptText(nonEmptySections);
  const totalTokens = estimatePromptTokens(promptText);
  
  return saveTemplate({
    name,
    description,
    sections: nonEmptySections,
    tags,
    totalTokens,
  });
}

export function loadTemplateIntoPrompt(templateId: string): boolean {
  const { templates } = useTemplateStore.getState();
  const { updateSection, addSection, removeSection, sections, setTemplateName } = usePromptStore.getState();
  
  const template = templates.find(t => t.id === templateId);
  
  if (!template) {
    return false;
  }
  
  // Set the template name in the prompt store
  setTemplateName(template.name);
  
  // Handle existing sections
  const existingIds = sections.map(s => s.id);
  const templateIds = template.sections.map(s => s.id);
  
  // Remove sections that aren't in the template and aren't required
  sections.forEach(section => {
    if (!templateIds.includes(section.id) && !section.isRequired) {
      removeSection(section.id);
    }
  });
  
  // Update or add sections from template
  template.sections.forEach(section => {
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
        isRequired: section.isRequired
      });
    }
  });
  
  return true;
}

export function getPopularTags(templates: PromptTemplate[]): string[] {
  const tagCounts = new Map<string, number>();
  
  templates.forEach(template => {
    template.tags?.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });
  
  return Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag)
    .slice(0, 10);
}
