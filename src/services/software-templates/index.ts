
import { SoftwareTemplate, SoftwareTemplateType } from './types';
import { 
  convertTemplateToSections, 
  countAreasInTemplate, 
  countSectionsInTemplate,
  getTemplatesByCategory,
  getSoftwareTemplates as getBaseSoftwareTemplates,
  getPromptEngineeringTemplates as getBasePromptEngineeringTemplates
} from './template-utils';

// Re-export types
export type { SoftwareTemplate, SoftwareTemplateType };

// Re-export utilities
export { 
  convertTemplateToSections, 
  countAreasInTemplate, 
  countSectionsInTemplate,
  getTemplatesByCategory,
  getSoftwareTemplates: getBaseSoftwareTemplates,
  getPromptEngineeringTemplates: getBasePromptEngineeringTemplates
};

/**
 * Get a software template by its id
 */
export function getSoftwareTemplateById(id: string): SoftwareTemplate | undefined {
  const allTemplates = getBaseSoftwareTemplates();
  return allTemplates.find((template: SoftwareTemplate) => template.id === id);
}

/**
 * Get all available software templates
 */
export function getAllSoftwareTemplates(): SoftwareTemplate[] {
  return getBaseSoftwareTemplates();
}

/**
 * Get all software development templates
 */
export function getAllSoftwareDevelopmentTemplates(): SoftwareTemplate[] {
  const allTemplates = getBaseSoftwareTemplates();
  return getTemplatesByCategory(allTemplates, 'software');
}

/**
 * Get all prompt engineering templates
 */
export function getAllPromptEngineeringTemplates(): SoftwareTemplate[] {
  const allTemplates = getBaseSoftwareTemplates();
  return getTemplatesByCategory(allTemplates, 'prompt_engineering');
}
