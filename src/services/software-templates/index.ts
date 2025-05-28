
import { SoftwareTemplate, SoftwareTemplateType } from './types';
import { getAvailableSoftwareTemplates } from '../template-service';
import { 
  convertTemplateToSections, 
  countAreasInTemplate, 
  countSectionsInTemplate,
  getTemplatesByCategory,
  getSoftwareTemplates,
  getPromptEngineeringTemplates
} from './template-utils';

// Re-export types
export type { SoftwareTemplate, SoftwareTemplateType };

// Re-export utilities
export { 
  convertTemplateToSections, 
  countAreasInTemplate, 
  countSectionsInTemplate,
  getTemplatesByCategory,
  getSoftwareTemplates,
  getPromptEngineeringTemplates
};

/**
 * Get a software template by its id
 */
export function getSoftwareTemplateById(id: string): SoftwareTemplate | undefined {
  const allTemplates = getSoftwareTemplates();
  return allTemplates.find((template: SoftwareTemplate) => template.id === id);
}

/**
 * Get all available software templates
 */
export function getAllSoftwareTemplates(): SoftwareTemplate[] {
  return getSoftwareTemplates();
}

/**
 * Get all software development templates
 */
export function getAllSoftwareDevelopmentTemplates(): SoftwareTemplate[] {
  const allTemplates = getSoftwareTemplates();
  return getTemplatesByCategory(allTemplates, 'software');
}

/**
 * Get all prompt engineering templates
 */
export function getAllPromptEngineeringTemplates(): SoftwareTemplate[] {
  const allTemplates = getSoftwareTemplates();
  return getTemplatesByCategory(allTemplates, 'prompt_engineering');
}
