
import { SoftwareTemplate, SoftwareTemplateType } from './types';
import { 
  convertTemplateToSections, 
  countAreasInTemplate, 
  countSectionsInTemplate,
  getTemplatesByCategory,
  getSoftwareTemplates as getBaseSoftwareTemplates,
  getPromptEngineeringTemplates as getBasePromptEngineeringTemplates
} from './template-utils';

// Import the actual template data
import { webAppBasicSections, mobileAppSections, apiServiceSections } from './template-data';

// Create the templates array
const allTemplates: SoftwareTemplate[] = [
  {
    id: 'web-app-basic',
    name: 'Basic Web Application',
    description: 'A template for basic web application development',
    type: 'web_app_basic',
    category: 'software',
    sections: webAppBasicSections,
    complexity: 'low',
    estimatedTime: '1-2 weeks',
    areaCount: 0,
    sectionCount: webAppBasicSections.length,
    tags: ['web', 'basic', 'frontend']
  },
  {
    id: 'mobile-app',
    name: 'Mobile Application',
    description: 'A template for mobile application development',
    type: 'mobile_app',
    category: 'software',
    sections: mobileAppSections,
    complexity: 'medium',
    estimatedTime: '2-4 weeks',
    areaCount: 0,
    sectionCount: mobileAppSections.length,
    tags: ['mobile', 'react-native', 'ios', 'android']
  },
  {
    id: 'api-service',
    name: 'API Service',
    description: 'A template for API service development',
    type: 'api_service',
    category: 'software',
    sections: apiServiceSections,
    complexity: 'medium',
    estimatedTime: '2-3 weeks',
    areaCount: 0,
    sectionCount: apiServiceSections.length,
    tags: ['api', 'backend', 'rest', 'service']
  }
];

// Re-export types
export type { SoftwareTemplate, SoftwareTemplateType };

// Re-export utilities
export { 
  convertTemplateToSections, 
  countAreasInTemplate, 
  countSectionsInTemplate,
  getTemplatesByCategory,
  getBaseSoftwareTemplates as getSoftwareTemplates,
  getBasePromptEngineeringTemplates as getPromptEngineeringTemplates
};

/**
 * Get a software template by its id
 */
export function getSoftwareTemplateById(id: string): SoftwareTemplate | undefined {
  return allTemplates.find((template: SoftwareTemplate) => template.id === id);
}

/**
 * Get all available software templates
 */
export function getAllSoftwareTemplates(): SoftwareTemplate[] {
  return allTemplates;
}

/**
 * Get all software development templates
 */
export function getAllSoftwareDevelopmentTemplates(): SoftwareTemplate[] {
  return getTemplatesByCategory(allTemplates, 'software');
}

/**
 * Get all prompt engineering templates
 */
export function getAllPromptEngineeringTemplates(): SoftwareTemplate[] {
  return getTemplatesByCategory(allTemplates, 'prompt_engineering');
}
