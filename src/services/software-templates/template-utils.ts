
import { PromptSection } from '@/types/prompt';
import { SoftwareTemplate } from './types';

/**
 * Convert a software template to prompt sections, ensuring no duplicates
 */
export function convertTemplateToSections(template: SoftwareTemplate): PromptSection[] {
  // Track used area IDs to prevent duplicates
  const usedAreaIds = new Set<string>();
  
  return template.sections.map(section => {
    let newId = crypto.randomUUID();
    
    // If this is an area, make sure we don't have duplicate IDs
    if (section.isArea) {
      // Create a map to track which area names we've seen
      usedAreaIds.add(section.name);
    }
    
    return {
      ...section,
      id: newId // Generate new IDs to avoid collisions
    };
  });
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
 * Filter templates by category
 */
export function getTemplatesByCategory(templates: SoftwareTemplate[], category: 'software' | 'prompt_engineering'): SoftwareTemplate[] {
  return templates.filter(template => template.category === category);
}

/**
 * Get software development templates only
 */
export function getSoftwareTemplates(templates: SoftwareTemplate[]): SoftwareTemplate[] {
  return getTemplatesByCategory(templates, 'software');
}

/**
 * Get prompt engineering templates only
 */
export function getPromptEngineeringTemplates(templates: SoftwareTemplate[]): SoftwareTemplate[] {
  return getTemplatesByCategory(templates, 'prompt_engineering');
}
