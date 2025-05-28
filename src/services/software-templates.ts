
import { PromptSection } from '@/types/prompt';
import { STANDARD_SECTIONS, DEFAULT_AREAS } from './prompt-parser/constants';

// Create a simple web app template
export const createSimpleWebAppTemplate = (): PromptSection[] => {
  return [
    {
      id: 'overview',
      name: 'Project Overview',
      content: 'Define the main purpose and goals of the web application.',
      order: 0,
      isRequired: true,
      level: 1,
      isArea: false
    },
    {
      id: 'features',
      name: 'Core Features',
      content: 'List the essential features and functionality.',
      order: 1,
      isRequired: true,
      level: 1,
      isArea: false
    },
    {
      id: 'tech-stack',
      name: 'Technology Stack',
      content: 'Specify the technologies, frameworks, and tools to be used.',
      order: 2,
      isRequired: true,
      level: 1,
      isArea: false
    }
  ];
};

// Get all software template functions
export const getSoftwareTemplates = () => {
  return [
    {
      id: 'simple-web-app',
      name: 'Simple Web Application',
      description: 'A basic template for web application development',
      complexity: 'low' as const,
      estimatedTime: '1-2 weeks',
      type: 'web_app_simple' as const,
      category: 'software' as const,
      sections: createSimpleWebAppTemplate(),
      areaCount: 0,
      sectionCount: 3,
      tags: ['web', 'frontend', 'simple']
    }
  ];
};
