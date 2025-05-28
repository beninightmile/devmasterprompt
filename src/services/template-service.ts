import { useTemplateStore } from '@/store/templateStore';
import { usePromptStore } from '@/store/promptStore';
import { PromptTemplate } from '@/types/prompt';
import { DEFAULT_AREAS, STANDARD_SECTIONS } from './prompt-parser';
import { PromptSection } from '@/types/prompt';

export const saveCurrentPromptAsTemplate = (
  name: string, 
  description: string | undefined, 
  tags: string[] | undefined
): void => {
  const { sections, templateName } = usePromptStore.getState();
  const { addTemplate } = useTemplateStore.getState();
  
  const totalTokens = sections.reduce((acc, section) => acc + section.content.length, 0);
  
  const template: Omit<PromptTemplate, 'id' | 'createdAt' | 'updatedAt'> = {
    name,
    description: description || '',
    sections,
    tags: tags || [],
    totalTokens,
  };
  
  if (templateName) {
    const { updateTemplate } = useTemplateStore.getState();
    updateTemplate(templateName, template);
  } else {
    addTemplate(template);
  }
};

export const loadTemplateIntoPrompt = (templateId: string): boolean => {
  const { clearAll } = usePromptStore.getState();
  
  return true;
};

export const getPopularTags = (templates: PromptTemplate[]): string[] => {
  const tagCount: Record<string, number> = {};
  
  templates.forEach(template => {
    template.tags?.forEach(tag => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });
  
  return Object.entries(tagCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([tag]) => tag);
};

import { SoftwareTemplate } from './software-templates/types';

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

// Helper function for complex content
function getComplexContent(sectionName: string): string {
  const contentMap: Record<string, string> = {
    'Projektname': 'Umfassende Enterprise Web-Anwendung',
    'Beschreibung': 'Eine hochskalierbare, benutzerfreundliche Web-Anwendung mit modernen Technologien...',
    'Zielsetzung und unveränderliche Regeln': 'Entwicklung einer robusten, wartbaren und erweiterbaren Lösung...'
  };
  return contentMap[sectionName] || '';
}

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
