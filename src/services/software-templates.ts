import { SoftwareTemplate } from './software-templates/types';
import { DEFAULT_AREAS, STANDARD_SECTIONS } from './prompt-parser';
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
  | 'microservice_architecture'
  | 'zero_shot_template'
  | 'roses_framework'
  | 'chain_of_thought'
  | 'prompt_framework';

// Interface for the software template metadata
export interface SoftwareTemplate {
  id: string;
  name: string;
  description: string;
  complexity: 'low' | 'medium' | 'high' | 'enterprise';
  estimatedTime: string;  // "3-5 days", "2-4 weeks", etc.
  type: SoftwareTemplateType;
  category: 'software' | 'prompt_engineering';  // Added category property
  sections: PromptSection[];
  areaCount: number; // Number of areas in the template
  sectionCount: number; // Number of non-area sections in the template
}

// Helper function to create an area with children
const createTemplateArea = (areaProps: {
  id: string;
  name: string;
  content?: string;
  order: number;
  children?: Array<{
    name: string;
    content: string;
    isRequired?: boolean;
  }>;
}): PromptSection[] => {
  const { id, name, content = '', order, children = [] } = areaProps;
  
  // Create the area
  const area: PromptSection = {
    id,
    name,
    content,
    order,
    isRequired: false,
    level: 1,
    isArea: true
  };
  
  // Create child sections
  const childSections = children.map((child, index) => ({
    id: `${id}-child-${index}`,
    name: child.name,
    content: child.content,
    order: order + index + 1,
    isRequired: child.isRequired || false,
    level: 2,
    parentId: id
  }));
  
  return [area, ...childSections];
};

// Helper function to create standard sections
const createStandardSections = (): PromptSection[] => {
  return STANDARD_SECTIONS.map((section, index) => ({
    id: `standard-${index}`,
    name: section.name,
    content: '',
    order: index + 1,
    isRequired: true,
    level: 1
  }));
};

// Collection of predefined software templates using the hierarchical structure
export const softwareTemplates: SoftwareTemplate[] = [
  {
    id: 'web_simple',
    name: 'Einfache Web-Anwendung',
    description: 'Grundlegende Webanwendung mit einigen Seiten und einfacher Funktionalität.',
    complexity: 'low',
    estimatedTime: '1-3 Tage',
    type: 'web_app_simple',
    category: 'software',
    sections: [
      // Standard sections first
      ...createStandardSections(),
      
      // Tech Stack Area
      ...createTemplateArea({
        id: 'core_1',
        name: 'Technologie-Stack & Tooling',
        order: 10,
        children: [
          {
            name: 'Framework & Sprache',
            content: 'React mit TypeScript',
            isRequired: true
          },
          {
            name: 'Styling',
            content: 'Tailwind CSS',
            isRequired: true
          },
          {
            name: 'UI-Komponenten',
            content: 'Shadcn UI',
            isRequired: false
          }
        ]
      }),
      
      // Architecture Area
      ...createTemplateArea({
        id: 'core_2',
        name: 'Projektstruktur & Architekturprinzipien',
        order: 20,
        children: [
          {
            name: 'Dateisystem-Organisation',
            content: 'Feature-basierte Ordnerstruktur',
            isRequired: true
          }
        ]
      }),
      
      // UI/UX Area
      ...createTemplateArea({
        id: 'core_3',
        name: 'UI-System & Design-Konventionen',
        order: 30,
        children: [
          {
            name: 'Design-System',
            content: 'Einheitliches Farb- und Typografieschema',
            isRequired: true
          }
        ]
      }),
      
      // Core Features Area
      ...createTemplateArea({
        id: 'core_6',
        name: 'Kernmodule & Funktionalitäten',
        order: 60,
        children: [
          {
            name: 'Hauptfunktionen',
            content: 'Liste der Hauptfunktionen der Anwendung',
            isRequired: true
          }
        ]
      })
    ],
    // Calculate area and section counts
    get areaCount() { 
      return this.sections.filter(s => s.isArea).length;
    },
    get sectionCount() {
      return this.sections.filter(s => !s.isArea && s.level > 1).length;
    }
  },
  {
    id: 'web_complex',
    name: 'Komplexe Web-Anwendung',
    description: 'Fortgeschrittene Webanwendung mit mehreren Funktionen, Benutzerauthentifizierung und Datenverwaltung.',
    complexity: 'medium',
    estimatedTime: '1-3 Wochen',
    type: 'web_app_complex',
    category: 'software',
    sections: [
      // Standard sections first
      ...createStandardSections(),
      
      // Tech Stack Area
      ...createTemplateArea({
        id: 'core_1',
        name: 'Technologie-Stack & Tooling',
        order: 10,
        children: [
          {
            name: 'Framework & Sprache',
            content: 'React mit TypeScript',
            isRequired: true
          },
          {
            name: 'Styling',
            content: 'Tailwind CSS mit Theme-Anpassungen',
            isRequired: true
          },
          {
            name: 'State Management',
            content: 'Zustand für globalen Zustand, React Query für Server-State',
            isRequired: true
          },
          {
            name: 'Backend-Integration',
            content: 'RESTful API mit Axios',
            isRequired: true
          }
        ]
      }),
      
      // Architecture Area
      ...createTemplateArea({
        id: 'core_2',
        name: 'Projektstruktur & Architekturprinzipien',
        order: 20,
        children: [
          {
            name: 'Architekturmuster',
            content: 'Feature-basierte Architektur mit klarer Trennung von Zustand und UI',
            isRequired: true
          },
          {
            name: 'Code-Organisation',
            content: 'Modularisierung nach Funktionen',
            isRequired: true
          }
        ]
      }),
      
      // Security Area
      ...createTemplateArea({
        id: 'core_4',
        name: 'Security, Authentifizierung & Rollenmanagement',
        order: 40,
        children: [
          {
            name: 'Authentifizierungsstrategie',
            content: 'JWT-basierte Authentifizierung',
            isRequired: true
          },
          {
            name: 'Benutzerrollen',
            content: 'Beschreibung der Benutzerrollen und Berechtigungen',
            isRequired: true
          }
        ]
      }),
      
      // Routing Area
      ...createTemplateArea({
        id: 'core_5',
        name: 'Standard-Routing & Seitenstruktur',
        order: 50,
        children: [
          {
            name: 'Routendefinitionen',
            content: 'Definition der Hauptrouten und Seitenübergänge',
            isRequired: true
          },
          {
            name: 'Geschützte Routen',
            content: 'Implementation von geschützten Routen basierend auf Benutzerrollen',
            isRequired: true
          }
        ]
      }),
      
      // Features Area
      ...createTemplateArea({
        id: 'core_6',
        name: 'Kernmodule & Funktionalitäten',
        order: 60,
        children: [
          {
            name: 'Benutzerverwaltung',
            content: 'Funktionen für Benutzerregistrierung, Login, Profilverwaltung',
            isRequired: true
          },
          {
            name: 'Datenintegrationen',
            content: 'Beschreibung der Datenquellen und Integrationen',
            isRequired: true
          }
        ]
      })
    ],
    get areaCount() { 
      return this.sections.filter(s => s.isArea).length;
    },
    get sectionCount() {
      return this.sections.filter(s => !s.isArea && s.level > 1).length;
    }
  },
  {
    id: 'fullstack',
    name: 'Full-Stack-Anwendung',
    description: 'Komplette Anwendung mit Frontend, Backend, Datenbank und erweiterten Funktionen.',
    complexity: 'high',
    estimatedTime: '3-6 Wochen',
    type: 'fullstack_application',
    category: 'software',
    sections: [
      // Standard sections first
      ...createStandardSections(),
      
      // Create areas based on DEFAULT_AREAS
      ...DEFAULT_AREAS.flatMap((defaultArea, index) => {
        const uniqueId = `fullstack-area-${index}`;
        
        return createTemplateArea({
          id: uniqueId,
          name: defaultArea.area.name,
          order: (index + 1) * 10 + STANDARD_SECTIONS.length,
          children: [
            {
              name: `${defaultArea.area.name} - Hauptsektion`,
              content: 'Detaillierte Informationen zu diesem Bereich...',
              isRequired: true
            },
            {
              name: `${defaultArea.area.name} - Details`,
              content: 'Weitere Details zu diesem Bereich...',
              isRequired: false
            }
          ]
        });
      })
    ],
    get areaCount() { 
      return this.sections.filter(s => s.isArea).length;
    },
    get sectionCount() {
      return this.sections.filter(s => !s.isArea && s.level > 1).length;
    }
  }
];

// Sample prompt engineering templates
export const promptEngineeringTemplates: SoftwareTemplate[] = [
  {
    id: 'zero_shot_framework',
    name: 'Zero-Shot Prompt Framework',
    description: 'Strukturiertes Framework für Zero-Shot Prompting mit Role, Context, Task, Format und Parameters.',
    complexity: 'low',
    estimatedTime: '15-30 Minuten',
    type: 'zero_shot_template',
    category: 'prompt_engineering',
    sections: [
      ...createTemplateArea({
        id: 'zero_shot_role',
        name: 'Role Definition',
        content: 'Definiere die Rolle und Expertise der KI',
        order: 1,
        children: [
          {
            name: 'Expert Role',
            content: 'Du bist ein [spezifische Rolle] mit [Jahre] Jahren Erfahrung in [Bereich].',
            isRequired: true
          }
        ]
      })
    ],
    get areaCount() { 
      return this.sections.filter(s => s.isArea).length;
    },
    get sectionCount() {
      return this.sections.filter(s => !s.isArea && s.level > 1).length;
    }
  }
];

// Combine all templates
export const allTemplates: SoftwareTemplate[] = [
  ...softwareTemplates,
  ...promptEngineeringTemplates
];

/**
 * Get a software template by its id
 */
export function getSoftwareTemplateById(id: string): SoftwareTemplate | undefined {
  return allTemplates.find(template => template.id === id);
}

/**
 * Get all available software templates
 */
export function getAllSoftwareTemplates(): SoftwareTemplate[] {
  return allTemplates;
}

/**
 * Get software development templates
 */
export function getSoftwareTemplates(templates?: SoftwareTemplate[]): SoftwareTemplate[] {
  const templatesArray = templates || allTemplates;
  return templatesArray.filter(template => template.category === 'software');
}

/**
 * Get prompt engineering templates
 */
export function getPromptEngineeringTemplates(templates?: SoftwareTemplate[]): SoftwareTemplate[] {
  const templatesArray = templates || allTemplates;
  return templatesArray.filter(template => template.category === 'prompt_engineering');
}

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

// Helper function for complex content
function getComplexContent(sectionName: string): string {
  const contentMap: Record<string, string> = {
    'Projektname': 'Umfassende Enterprise Web-Anwendung',
    'Beschreibung': 'Eine hochskalierbare, benutzerfreundliche Web-Anwendung mit modernen Technologien...',
    'Zielsetzung und unveränderliche Regeln': 'Entwicklung einer robusten, wartbaren und erweiterbaren Lösung...'
  };
  return contentMap[sectionName] || '';
}

// Create software templates
const createWebAppSimple = (): SoftwareTemplate => {
  const sections: PromptSection[] = [];

  // Add standard sections
  STANDARD_SECTIONS.forEach((section: any, index: number) => {
    sections.push({
      ...section,
      id: crypto.randomUUID(),
      content: '',
      order: index
    });
  });

  // Add default areas and their sections
  DEFAULT_AREAS.forEach(({ area, sections: areaSections }) => {
    const areaId = crypto.randomUUID();
    const areaOrder = 100 + sections.length;

    // Add the area
    sections.push({
      ...area,
      id: areaId,
      content: '',
      order: areaOrder
    });

    // Add child sections
    areaSections.forEach((section: any) => {
      sections.push({
        ...section,
        id: crypto.randomUUID(),
        content: '',
        parentId: areaId,
        order: section.order || 1
      });
    });
  });

  return {
    id: 'web_app_simple',
    name: 'Einfache Web-Anwendung',
    description: 'Ein grundlegender Software-Template für eine einfache Web-Anwendung mit React und modernen Entwicklungstools.',
    complexity: 'low',
    estimatedTime: '3-5 Tage',
    type: 'web_app_simple',
    category: 'software',
    sections,
    areaCount: DEFAULT_AREAS.length,
    sectionCount: STANDARD_SECTIONS.length + DEFAULT_AREAS.reduce((acc, { sections: areaSections }) => acc + areaSections.length, 0),
    tags: ['React', 'TypeScript', 'Web']
  };
};

const createWebAppComplex = (): SoftwareTemplate => {
  const sections: PromptSection[] = [];

  // Add standard sections
  STANDARD_SECTIONS.forEach((section: any, index: number) => {
    sections.push({
      ...section,
      id: crypto.randomUUID(),
      content: getComplexContent(section.name),
      order: index
    });
  });

  // Add enhanced areas for complex apps
  const complexAreas = [
    ...DEFAULT_AREAS,
    {
      area: {
        name: 'State Management',
        order: 500,
        isRequired: false,
        level: 1,
        isArea: true
      },
      sections: [
        {
          name: 'Zustand-Architektur',
          order: 1,
          isRequired: false,
          level: 2
        },
        {
          name: 'Datenfluss',
          order: 2,
          isRequired: false,
          level: 2
        }
      ]
    }
  ];

  complexAreas.forEach(({ area, sections: areaSections }) => {
    const areaId = crypto.randomUUID();

    // Add the area
    sections.push({
      ...area,
      id: areaId,
      content: ''
    });

    // Add child sections
    areaSections.forEach((section: any) => {
      sections.push({
        ...section,
        id: crypto.randomUUID(),
        content: '',
        parentId: areaId
      });
    });
  });

  return {
    id: 'web_app_complex',
    name: 'Komplexe Web-Anwendung',
    description: 'Ein umfassender Software-Template für komplexe Web-Anwendungen mit erweiterten Features.',
    complexity: 'high',
    estimatedTime: '2-4 Wochen',
    type: 'web_app_complex',
    category: 'software',
    sections,
    areaCount: 5,
    sectionCount: sections.filter(s => !s.isArea).length,
    tags: ['React', 'TypeScript', 'Complex', 'Enterprise']
  };
};

const createMobileApp = (): SoftwareTemplate => {
  const sections: PromptSection[] = [
    {
      id: crypto.randomUUID(),
      name: 'Projektname',
      content: 'Mobile App Entwicklung',
      order: 1,
      isRequired: true,
      level: 1
    },
    {
      id: crypto.randomUUID(),
      name: 'Plattform-Spezifikationen',
      content: 'iOS und Android Kompatibilität, React Native oder native Entwicklung',
      order: 2,
      isRequired: true,
      level: 1
    },
    {
      id: crypto.randomUUID(),
      name: 'UI/UX Design für Mobile',
      content: 'Touch-optimierte Benutzeroberfläche, responsive Design für verschiedene Bildschirmgrößen',
      order: 3,
      isRequired: true,
      level: 1
    },
    {
      id: crypto.randomUUID(),
      name: 'Performance-Optimierung',
      content: 'Batterieeffizienz, Ladezeiten, Offline-Funktionalität',
      order: 4,
      isRequired: true,
      level: 1
    }
  ];

  return {
    id: 'mobile_app',
    name: 'Mobile Anwendung',
    description: 'Template für die Entwicklung mobiler Anwendungen mit plattformspezifischen Anforderungen.',
    complexity: 'medium',
    estimatedTime: '1-3 Wochen',
    type: 'mobile_app',
    category: 'software',
    sections,
    areaCount: 0,
    sectionCount: sections.length,
    tags: ['Mobile', 'React Native', 'iOS', 'Android']
  };
};

export const getAvailableSoftwareTemplates = (): SoftwareTemplate[] => {
  return [
    createWebAppSimple(),
    createWebAppComplex(),
    createMobileApp()
  ];
};

export const getSoftwareTemplateById = (id: string): SoftwareTemplate | null => {
  const templates = getAvailableSoftwareTemplates();
  return templates.find(template => template.id === id) || null;
};
