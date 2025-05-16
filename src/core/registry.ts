
/**
 * Feature registry - Manages available features and their configurations
 */

export type Feature = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  defaultSections: PromptSectionTemplate[];
};

export type PromptSectionTemplate = {
  id: string;
  name: string;
  description: string;
  defaultContent: string;
  required: boolean;
  order: number;
};

// Default prompt sections that are always available
export const defaultPromptSections: PromptSectionTemplate[] = [
  {
    id: "project-name",
    name: "Project Name",
    description: "The name of the project or application",
    defaultContent: "",
    required: true,
    order: 0,
  },
  {
    id: "project-description",
    name: "Project Description",
    description: "A brief description of the project",
    defaultContent: "",
    required: true,
    order: 1,
  },
  {
    id: "project-goal",
    name: "Goal",
    description: "The primary goal or purpose of the project",
    defaultContent: "",
    required: true,
    order: 2,
  },
  {
    id: "code-structure",
    name: "Code Structure",
    description: "How the code should be organized and structured",
    defaultContent: "",
    required: false,
    order: 3,
  },
  {
    id: "code-quality",
    name: "Code Quality",
    description: "Standards for code quality and best practices",
    defaultContent: "",
    required: false,
    order: 4,
  },
  {
    id: "ui-look",
    name: "UI Look",
    description: "Visual design and UI components",
    defaultContent: "",
    required: false,
    order: 5,
  },
  {
    id: "component-usage",
    name: "Component Usage",
    description: "How to use and organize components",
    defaultContent: "",
    required: false,
    order: 6,
  },
  {
    id: "state-management",
    name: "State Management",
    description: "How to manage application state",
    defaultContent: "",
    required: false,
    order: 7,
  },
  {
    id: "auth-system",
    name: "Auth System",
    description: "Authentication and authorization",
    defaultContent: "",
    required: false,
    order: 8,
  },
  {
    id: "database",
    name: "Database",
    description: "Database structure and design",
    defaultContent: "",
    required: false,
    order: 9,
  },
  {
    id: "api-strategy",
    name: "API Strategy",
    description: "How APIs are structured and used",
    defaultContent: "",
    required: false,
    order: 10,
  },
  {
    id: "validation",
    name: "Validation",
    description: "Data validation approaches",
    defaultContent: "",
    required: false,
    order: 11,
  },
  {
    id: "testing",
    name: "Testing",
    description: "Testing strategies and tools",
    defaultContent: "",
    required: false,
    order: 12,
  },
  {
    id: "ci-cd",
    name: "CI/CD",
    description: "Continuous integration and deployment practices",
    defaultContent: "",
    required: false,
    order: 13,
  },
  {
    id: "deployment",
    name: "Deployment",
    description: "Deployment strategies and environments",
    defaultContent: "",
    required: false,
    order: 14,
  },
  {
    id: "roles-access",
    name: "Roles & Access",
    description: "User roles and access control",
    defaultContent: "",
    required: false,
    order: 15,
  },
  {
    id: "file-handling",
    name: "File Handling",
    description: "How files are uploaded, stored, and managed",
    defaultContent: "",
    required: false,
    order: 16,
  },
  {
    id: "i18n",
    name: "Language & I18n",
    description: "Internationalization and localization",
    defaultContent: "",
    required: false,
    order: 17,
  },
  {
    id: "target-audience",
    name: "Target Audience",
    description: "The intended users of the application",
    defaultContent: "",
    required: false,
    order: 18,
  },
  {
    id: "monetization",
    name: "Monetization",
    description: "Business model and revenue strategies",
    defaultContent: "",
    required: false,
    order: 19,
  },
];

// Features registry
export const features: Feature[] = [
  {
    id: "core",
    name: "Core Prompt Builder",
    description: "Essential prompt building functionality",
    enabled: true,
    defaultSections: defaultPromptSections,
  },
  {
    id: "templates",
    name: "Templates",
    description: "Save and load prompt templates",
    enabled: true,
    defaultSections: [],
  },
  {
    id: "inspiration",
    name: "Inspiration",
    description: "Media and links for prompt inspiration",
    enabled: true,
    defaultSections: [],
  },
];

// Get all enabled features
export function getEnabledFeatures(): Feature[] {
  return features.filter(feature => feature.enabled);
}

// Get all available prompt sections from enabled features
export function getAvailablePromptSections(): PromptSectionTemplate[] {
  return getEnabledFeatures()
    .flatMap(feature => feature.defaultSections)
    .sort((a, b) => a.order - b.order);
}
