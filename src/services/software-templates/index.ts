
import { SoftwareTemplate, SoftwareTemplateType } from './types';
import { softwareTemplates } from './template-data';
import { convertTemplateToSections, countAreasInTemplate, countSectionsInTemplate } from './template-utils';

// Re-export types
export type { SoftwareTemplate, SoftwareTemplateType };

// Re-export utilities
export { convertTemplateToSections, countAreasInTemplate, countSectionsInTemplate };

/**
 * Get a software template by its id
 */
export function getSoftwareTemplateById(id: string): SoftwareTemplate | undefined {
  return softwareTemplates.find(template => template.id === id);
}

/**
 * Get all available software templates
 */
export function getAllSoftwareTemplates(): SoftwareTemplate[] {
  return softwareTemplates;
}
