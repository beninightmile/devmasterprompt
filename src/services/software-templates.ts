
import { PromptSection } from '@/types/prompt';

// Define the types of software templates available
export type SoftwareTemplateType = 
  | 'web_app_simple' 
  | 'web_app_complex'
  | 'mobile_app' 
  | 'desktop_app'
  | 'api_service'
  | 'fullstack_application'
  | 'enterprise_system'
  | 'microservice_architecture';

// Interface for the software template metadata
export interface SoftwareTemplate {
  id: string;
  name: string;
  description: string;
  complexity: 'low' | 'medium' | 'high' | 'enterprise';
  estimatedTime: string;  // "3-5 days", "2-4 weeks", etc.
  type: SoftwareTemplateType;
  sections: Array<Omit<PromptSection, 'id' | 'order'>>;
}

// Collection of predefined software templates
export const softwareTemplates: SoftwareTemplate[] = [
  {
    id: 'web_simple',
    name: 'Simple Web Application',
    description: 'Basic web application with a few pages and simple functionality.',
    complexity: 'low',
    estimatedTime: '1-3 days',
    type: 'web_app_simple',
    sections: [
      {
        name: 'Project Name',
        content: '',
        isRequired: true,
      },
      {
        name: 'Project Description',
        content: '',
        isRequired: true,
      },
      {
        name: 'Core Requirements',
        content: 'List the essential features and functionality your application needs.',
        isRequired: true,
      },
      {
        name: 'UI/UX Guidelines',
        content: 'Describe the look and feel you want for your application.',
        isRequired: false,
      },
      {
        name: 'Technologies',
        content: 'Preferred technologies or frameworks (e.g. React, Vue, etc.)',
        isRequired: false,
      }
    ]
  },
  {
    id: 'web_complex',
    name: 'Complex Web Application',
    description: 'Advanced web application with multiple features, user authentication, and data management.',
    complexity: 'medium',
    estimatedTime: '1-3 weeks',
    type: 'web_app_complex',
    sections: [
      {
        name: 'Project Name',
        content: '',
        isRequired: true,
      },
      {
        name: 'Project Description',
        content: '',
        isRequired: true,
      },
      {
        name: 'Core Requirements',
        content: 'List the essential features and functionality your application needs.',
        isRequired: true,
      },
      {
        name: 'Authentication',
        content: 'What type of authentication do you need? (email/password, social auth, etc.)',
        isRequired: true,
      },
      {
        name: 'Data Models',
        content: 'Describe the main entities and their relationships in your application.',
        isRequired: true,
      },
      {
        name: 'UI/UX Guidelines',
        content: 'Describe the look and feel you want for your application.',
        isRequired: false,
      },
      {
        name: 'Technologies',
        content: 'Preferred technologies or frameworks (e.g. React, Next.js, etc.)',
        isRequired: false,
      },
      {
        name: 'User Roles & Permissions',
        content: 'Define different user types and what they should be able to access.',
        isRequired: false,
      }
    ]
  },
  {
    id: 'fullstack',
    name: 'Full-stack Application',
    description: 'Complete application with frontend, backend, database, and advanced features.',
    complexity: 'high',
    estimatedTime: '3-6 weeks',
    type: 'fullstack_application',
    sections: [
      {
        name: 'Project Name',
        content: '',
        isRequired: true,
      },
      {
        name: 'Project Description',
        content: '',
        isRequired: true,
      },
      {
        name: 'Frontend Requirements',
        content: 'Describe the user interface and user experience requirements.',
        isRequired: true,
      },
      {
        name: 'Backend Requirements',
        content: 'Describe the server-side functionality and API requirements.',
        isRequired: true,
      },
      {
        name: 'Database Design',
        content: 'Describe the data structure and relationships.',
        isRequired: true,
      },
      {
        name: 'Authentication & Authorization',
        content: 'Describe the authentication method and user permission system.',
        isRequired: true,
      },
      {
        name: 'API Specifications',
        content: 'List and describe the API endpoints needed.',
        isRequired: false,
      },
      {
        name: 'Deployment Requirements',
        content: 'Describe how and where the application should be deployed.',
        isRequired: false,
      },
      {
        name: 'Technologies',
        content: 'Specify preferred technologies for frontend, backend, and database.',
        isRequired: false,
      },
      {
        name: 'Third-party Integrations',
        content: 'List any external services or APIs you want to integrate.',
        isRequired: false,
      }
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise System',
    description: 'Large-scale application with complex business logic, multiple integrations, and high scalability requirements.',
    complexity: 'enterprise',
    estimatedTime: '2-6 months',
    type: 'enterprise_system',
    sections: [
      {
        name: 'Project Name',
        content: '',
        isRequired: true,
      },
      {
        name: 'Project Description',
        content: '',
        isRequired: true,
      },
      {
        name: 'Business Domain',
        content: 'Describe the business domain and core business processes.',
        isRequired: true,
      },
      {
        name: 'System Architecture',
        content: 'Describe the overall system architecture and design patterns.',
        isRequired: true,
      },
      {
        name: 'Authentication & Security',
        content: 'Describe security requirements, authentication methods, and authorization model.',
        isRequired: true,
      },
      {
        name: 'Data Models & Database',
        content: 'Define the data models, relationships, and database requirements.',
        isRequired: true,
      },
      {
        name: 'Frontend Requirements',
        content: 'Describe the user interface and experience requirements across different user roles.',
        isRequired: true,
      },
      {
        name: 'Backend Services',
        content: 'Define the backend services, APIs, and their responsibilities.',
        isRequired: true,
      },
      {
        name: 'Integration Requirements',
        content: 'List all external systems and how they should be integrated.',
        isRequired: true,
      },
      {
        name: 'Performance & Scalability',
        content: 'Define performance expectations and scalability requirements.',
        isRequired: true,
      },
      {
        name: 'Deployment & DevOps',
        content: 'Describe the deployment strategy, environments, and CI/CD requirements.',
        isRequired: false,
      },
      {
        name: 'Monitoring & Observability',
        content: 'Define monitoring, logging, and alerting requirements.',
        isRequired: false,
      },
      {
        name: 'Compliance & Regulations',
        content: 'List any regulatory or compliance requirements the system must meet.',
        isRequired: false,
      }
    ]
  }
];

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

/**
 * Convert a software template to prompt sections
 */
export function convertTemplateToSections(template: SoftwareTemplate): PromptSection[] {
  return template.sections.map(section => ({
    id: crypto.randomUUID(),
    name: section.name,
    content: section.content,
    isRequired: section.isRequired,
    order: 0, // The order will be set by the store
  }));
}
