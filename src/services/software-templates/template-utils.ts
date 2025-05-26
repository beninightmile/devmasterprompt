
import { SoftwareTemplate } from './types';
import { PromptSection } from '@/types/prompt';

/**
 * Convert a software template to prompt sections, ensuring no duplicates
 */
export function convertTemplateToSections(template: SoftwareTemplate): PromptSection[] {
  return template.sections.map(section => ({
    ...section,
    id: crypto.randomUUID() // Generate new IDs to avoid collisions
  }));
}

/**
 * Count the number of areas in a template
 */
export function countAreasInTemplate(template: SoftwareTemplate): number {
  return template.sections.filter(section => section.isArea).length;
}

/**
 * Count the number of sections (non-areas) in a template
 */
export function countSectionsInTemplate(template: SoftwareTemplate): number {
  return template.sections.filter(section => !section.isArea).length;
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(templates: SoftwareTemplate[], category: 'software' | 'prompt_engineering'): SoftwareTemplate[] {
  return templates.filter(template => template.category === category);
}

/**
 * Get software development templates
 */
export function getSoftwareTemplates(templates: SoftwareTemplate[]): SoftwareTemplate[] {
  return getTemplatesByCategory(templates, 'software');
}

/**
 * Get prompt engineering templates
 */
export function getPromptEngineeringTemplates(templates: SoftwareTemplate[]): SoftwareTemplate[] {
  return getTemplatesByCategory(templates, 'prompt_engineering');
}
