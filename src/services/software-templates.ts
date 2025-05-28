
import type { SoftwareTemplate as SoftwareTemplateType } from './software-templates/types';
import { DEFAULT_AREAS, STANDARD_SECTIONS } from './prompt-parser/constants';

// Interface for creating software template sections
interface SoftwareTemplateSection {
  name: string;
  defaultContent: string;
  required: boolean;
  category?: string;
  level?: number;
}

// Helper function to create template sections
const createTemplateSection = (name: string, content: string, required = false, level = 1): SoftwareTemplateSection => ({
  name,
  defaultContent: content,
  required,
  level
});

// Simple Web App Template
const simpleWebAppSections: SoftwareTemplateSection[] = [
  createTemplateSection("Role", "You are an expert web developer specializing in building modern, responsive web applications.", true),
  createTemplateSection("Project Overview", "Create a simple, user-friendly web application with clean design and intuitive navigation.", true),
  createTemplateSection("Technical Requirements", "Use modern web technologies (HTML5, CSS3, JavaScript ES6+, responsive design principles).", true),
  createTemplateSection("UI/UX Guidelines", "Focus on clean, minimalist design with good contrast and readability.", false),
  createTemplateSection("Code Quality", "Write clean, well-commented code following best practices.", false),
];

// Complex Web App Template
const complexWebAppSections: SoftwareTemplateSection[] = [
  createTemplateSection("Role", "You are a senior full-stack developer with expertise in modern web frameworks and scalable architecture.", true),
  createTemplateSection("Project Architecture", "Design a scalable, maintainable web application with proper separation of concerns.", true),
  createTemplateSection("Frontend Requirements", "Build with React/Vue/Angular, state management, component architecture.", true),
  createTemplateSection("Backend Requirements", "RESTful API design, database integration, authentication, security.", true),
  createTemplateSection("Performance Optimization", "Implement lazy loading, caching strategies, and performance monitoring.", false),
  createTemplateSection("Testing Strategy", "Unit tests, integration tests, and end-to-end testing approach.", false),
  createTemplateSection("Deployment & DevOps", "CI/CD pipeline, containerization, monitoring, and logging.", false),
];

// Mobile App Template
const mobileAppSections: SoftwareTemplateSection[] = [
  createTemplateSection("Role", "You are a mobile app developer experienced in cross-platform development.", true),
  createTemplateSection("App Concept", "Define the mobile app's core functionality and target platform(s).", true),
  createTemplateSection("UI/UX for Mobile", "Design for touch interfaces, responsive layouts, and mobile-first approach.", true),
  createTemplateSection("Platform Considerations", "iOS/Android specific guidelines, native features, and performance.", false),
  createTemplateSection("Offline Functionality", "Data synchronization, local storage, and offline user experience.", false),
];

// Desktop App Template
const desktopAppSections: SoftwareTemplateSection[] = [
  createTemplateSection("Role", "You are a desktop application developer with expertise in native desktop frameworks.", true),
  createTemplateSection("Application Framework", "Choose appropriate framework (Electron, Qt, .NET, etc.) based on requirements.", true),
  createTemplateSection("Desktop UI Design", "Design for keyboard/mouse interaction, window management, and desktop conventions.", true),
  createTemplateSection("System Integration", "File system access, OS-specific features, and system notifications.", false),
  createTemplateSection("Cross-Platform Compatibility", "Ensure compatibility across different operating systems.", false),
];

// API Service Template
const apiServiceSections: SoftwareTemplateSection[] = [
  createTemplateSection("Role", "You are a backend developer specializing in API design and microservices architecture.", true),
  createTemplateSection("API Design", "RESTful/GraphQL API design with proper endpoint structure and documentation.", true),
  createTemplateSection("Data Models", "Database schema design, relationships, and data validation.", true),
  createTemplateSection("Authentication & Security", "Implement secure authentication, authorization, and data protection.", true),
  createTemplateSection("Error Handling", "Comprehensive error handling and meaningful error responses.", false),
  createTemplateSection("API Documentation", "Clear API documentation with examples and usage guidelines.", false),
];

// Fullstack Application Template
const fullstackAppSections: SoftwareTemplateSection[] = [
  createTemplateSection("Role", "You are a full-stack developer capable of handling both frontend and backend development.", true),
  createTemplateSection("System Architecture", "Overall system design connecting frontend, backend, and database layers.", true),
  createTemplateSection("Frontend Development", "User interface design and implementation with modern frameworks.", true),
  createTemplateSection("Backend Development", "Server-side logic, API development, and database management.", true),
  createTemplateSection("Database Design", "Data modeling, relationships, and optimization strategies.", true),
  createTemplateSection("Integration & Testing", "End-to-end integration and comprehensive testing strategy.", false),
];

// Enterprise System Template
const enterpriseSystemSections: SoftwareTemplateSection[] = [
  createTemplateSection("Role", "You are an enterprise software architect with experience in large-scale system design.", true),
  createTemplateSection("Enterprise Architecture", "Scalable, maintainable architecture for enterprise-level requirements.", true),
  createTemplateSection("Security & Compliance", "Enterprise security standards, compliance requirements, and audit trails.", true),
  createTemplateSection("Integration Strategy", "Integration with existing enterprise systems and third-party services.", true),
  createTemplateSection("Scalability & Performance", "Design for high availability, load balancing, and performance optimization.", true),
  createTemplateSection("Monitoring & Analytics", "Comprehensive monitoring, logging, and business intelligence.", false),
  createTemplateSection("Disaster Recovery", "Backup strategies, disaster recovery planning, and business continuity.", false),
];

// Microservice Architecture Template
const microserviceArchSections: SoftwareTemplateSection[] = [
  createTemplateSection("Role", "You are a microservices architect specializing in distributed systems design.", true),
  createTemplateSection("Service Decomposition", "Break down monolithic functionality into independent microservices.", true),
  createTemplateSection("Inter-Service Communication", "Design communication patterns, API contracts, and message queuing.", true),
  createTemplateSection("Data Management", "Database per service, data consistency, and distributed transactions.", true),
  createTemplateSection("Service Discovery", "Service registration, discovery mechanisms, and load balancing.", false),
  createTemplateSection("Monitoring & Observability", "Distributed tracing, centralized logging, and health monitoring.", false),
  createTemplateSection("Deployment Strategy", "Containerization, orchestration, and independent service deployment.", false),
];

// Zero-Shot Template (Prompt Engineering)
const zeroShotSections: SoftwareTemplateSection[] = [
  createTemplateSection("Role", "You are an AI assistant capable of understanding and completing tasks without prior examples.", true),
  createTemplateSection("Task Description", "Clearly define the specific task or problem to be solved.", true),
  createTemplateSection("Context & Background", "Provide relevant context and background information for the task.", true),
  createTemplateSection("Output Format", "Specify the desired format and structure of the response.", false),
  createTemplateSection("Constraints", "Define any limitations, requirements, or boundaries for the task.", false),
];

// ROSES Framework Template (Prompt Engineering)
const rosesFrameworkSections: SoftwareTemplateSection[] = [
  createTemplateSection("Role", "Define your specific role and expertise for this task.", true),
  createTemplateSection("Objective", "Clearly state the main goal or objective to be achieved.", true),
  createTemplateSection("Scenario", "Describe the context, situation, or scenario in detail.", true),
  createTemplateSection("Expected Solution", "Outline the expected type of solution or approach.", true),
  createTemplateSection("Sense Check", "Define criteria for evaluating and validating the solution.", false),
];

// Chain of Thought Template (Prompt Engineering)
const chainOfThoughtSections: SoftwareTemplateSection[] = [
  createTemplateSection("Role", "You are an AI assistant that thinks step-by-step through problems.", true),
  createTemplateSection("Problem Statement", "Clearly define the problem or question to be solved.", true),
  createTemplateSection("Thinking Process", "Break down the problem into logical steps and show your reasoning.", true),
  createTemplateSection("Step-by-Step Analysis", "Work through each step methodically, explaining your logic.", true),
  createTemplateSection("Final Answer", "Provide the final solution based on your step-by-step analysis.", true),
];

// General Prompt Framework Template
const promptFrameworkSections: SoftwareTemplateSection[] = [
  createTemplateSection("Context", "Provide background context and relevant information.", true),
  createTemplateSection("Instructions", "Clear, specific instructions for the task.", true),
  createTemplateSection("Examples", "Provide examples of desired input/output format.", false),
  createTemplateSection("Constraints", "Define limitations, requirements, or boundaries.", false),
  createTemplateSection("Output Format", "Specify the desired response format and structure.", false),
];

// Convert template sections to PromptSection format
const convertSectionsToPromptSections = (sections: SoftwareTemplateSection[]) => {
  return sections.map((section, index) => ({
    id: crypto.randomUUID(),
    name: section.name,
    content: section.defaultContent,
    order: index,
    isRequired: section.required,
    level: section.level ?? 1,
  }));
};

// Create the software templates
const createSoftwareTemplate = (
  id: string,
  name: string,
  description: string,
  type: string,
  complexity: 'low' | 'medium' | 'high' | 'enterprise',
  estimatedTime: string,
  sections: SoftwareTemplateSection[],
  category: 'software' | 'prompt_engineering' = 'software',
  tags: string[] = []
): SoftwareTemplateType => {
  const promptSections = convertSectionsToPromptSections(sections);
  return {
    id,
    name,
    description,
    complexity,
    estimatedTime,
    type: type as any,
    category,
    sections: promptSections,
    areaCount: 0,
    sectionCount: promptSections.length,
    tags
  };
};

// Export all software templates
export const SOFTWARE_TEMPLATES: SoftwareTemplateType[] = [
  createSoftwareTemplate(
    'web_app_simple',
    'Simple Web Application',
    'Basic web application with essential features and clean design',
    'web_app_simple',
    'low',
    '3-5 days',
    simpleWebAppSections,
    'software',
    ['web', 'frontend', 'beginner']
  ),
  createSoftwareTemplate(
    'web_app_complex',
    'Complex Web Application',
    'Advanced web application with full-stack architecture and modern frameworks',
    'web_app_complex',
    'high',
    '3-6 weeks',
    complexWebAppSections,
    'software',
    ['web', 'fullstack', 'advanced']
  ),
  createSoftwareTemplate(
    'mobile_app',
    'Mobile Application',
    'Cross-platform mobile application with native features',
    'mobile_app',
    'medium',
    '2-4 weeks',
    mobileAppSections,
    'software',
    ['mobile', 'cross-platform', 'ios', 'android']
  ),
  createSoftwareTemplate(
    'desktop_app',
    'Desktop Application',
    'Native desktop application for Windows, macOS, and Linux',
    'desktop_app',
    'medium',
    '2-3 weeks',
    desktopAppSections,
    'software',
    ['desktop', 'native', 'cross-platform']
  ),
  createSoftwareTemplate(
    'api_service',
    'API Service',
    'RESTful API service with database integration and documentation',
    'api_service',
    'medium',
    '1-2 weeks',
    apiServiceSections,
    'software',
    ['api', 'backend', 'microservice']
  ),
  createSoftwareTemplate(
    'fullstack_application',
    'Fullstack Application',
    'Complete application with frontend, backend, and database components',
    'fullstack_application',
    'high',
    '4-8 weeks',
    fullstackAppSections,
    'software',
    ['fullstack', 'web', 'backend', 'frontend']
  ),
  createSoftwareTemplate(
    'enterprise_system',
    'Enterprise System',
    'Large-scale enterprise system with security, compliance, and scalability',
    'enterprise_system',
    'enterprise',
    '3-6 months',
    enterpriseSystemSections,
    'software',
    ['enterprise', 'scalability', 'security', 'compliance']
  ),
  createSoftwareTemplate(
    'microservice_architecture',
    'Microservice Architecture',
    'Distributed microservices system with containerization and orchestration',
    'microservice_architecture',
    'enterprise',
    '2-4 months',
    microserviceArchSections,
    'software',
    ['microservices', 'distributed', 'containers', 'kubernetes']
  ),
  createSoftwareTemplate(
    'zero_shot_template',
    'Zero-Shot Prompt',
    'Template for creating effective zero-shot prompts without examples',
    'zero_shot_template',
    'low',
    '30 minutes',
    zeroShotSections,
    'prompt_engineering',
    ['prompt-engineering', 'zero-shot', 'ai']
  ),
  createSoftwareTemplate(
    'roses_framework',
    'ROSES Framework',
    'Structured prompt template using Role, Objective, Scenario, Expected Solution, Sense Check',
    'roses_framework',
    'medium',
    '45 minutes',
    rosesFrameworkSections,
    'prompt_engineering',
    ['prompt-engineering', 'framework', 'structured']
  ),
  createSoftwareTemplate(
    'chain_of_thought',
    'Chain of Thought',
    'Template for step-by-step reasoning and problem-solving prompts',
    'chain_of_thought',
    'medium',
    '1 hour',
    chainOfThoughtSections,
    'prompt_engineering',
    ['prompt-engineering', 'reasoning', 'step-by-step']
  ),
  createSoftwareTemplate(
    'prompt_framework',
    'General Prompt Framework',
    'Flexible template for creating well-structured prompts',
    'prompt_framework',
    'low',
    '30 minutes',
    promptFrameworkSections,
    'prompt_engineering',
    ['prompt-engineering', 'general', 'framework']
  ),
];

// Helper functions for filtering templates
export const getSoftwareTemplates = (templates: SoftwareTemplateType[]) => 
  templates.filter(t => t.category === 'software');

export const getPromptEngineeringTemplates = (templates: SoftwareTemplateType[]) => 
  templates.filter(t => t.category === 'prompt_engineering');

export const getTemplatesByComplexity = (templates: SoftwareTemplateType[], complexity: string) =>
  templates.filter(t => t.complexity === complexity);

export const getTemplatesByTag = (templates: SoftwareTemplateType[], tag: string) =>
  templates.filter(t => t.tags?.includes(tag));

// Convert template to sections utility
export const convertTemplateToSections = (template: SoftwareTemplateType) => {
  return template.sections.map(s => ({
    ...s,
    level: s.level ?? 1,
    parentId: s.parentId || undefined,
    isArea: s.isArea ?? false,
  }));
};

// Count areas and sections in template
export const countAreasInTemplate = (template: SoftwareTemplateType) => {
  return template.sections.filter(s => s.isArea).length;
};

export const countSectionsInTemplate = (template: SoftwareTemplateType) => {
  return template.sections.filter(s => !s.isArea).length;
};

// Get templates by category
export const getTemplatesByCategory = (templates: SoftwareTemplateType[], category: 'software' | 'prompt_engineering') => {
  return templates.filter(t => t.category === category);
};
