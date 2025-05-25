
import { PromptSection } from '@/types/prompt';

// Standard sections that appear at the top level
export const STANDARD_SECTIONS: Omit<PromptSection, 'id' | 'content'>[] = [
  {
    name: 'Projektname',
    order: 1,
    isRequired: false,
    level: 1
  },
  {
    name: 'Beschreibung',
    order: 2,
    isRequired: false,
    level: 1
  },
  {
    name: 'Zielsetzung und unveränderliche Regeln',
    order: 3,
    isRequired: false,
    level: 1
  },
  {
    name: 'Referenz UI',
    order: 4,
    isRequired: false,
    level: 1
  }
];

// Default areas with their child sections
export const DEFAULT_AREAS: { area: Omit<PromptSection, 'id' | 'content'>; sections: Omit<PromptSection, 'id' | 'content' | 'parentId'>[] }[] = [
  {
    area: {
      name: 'Technologie Stack und Tooling',
      order: 100,
      isRequired: false,
      level: 1,
      isArea: true
    },
    sections: [
      {
        name: 'Technologie-Stack',
        order: 1,
        isRequired: false,
        level: 2
      },
      {
        name: 'Tooling',
        order: 2,
        isRequired: false,
        level: 2
      }
    ]
  },
  {
    area: {
      name: 'Architektur und Standards',
      order: 200,
      isRequired: false,
      level: 1,
      isArea: true
    },
    sections: [
      {
        name: 'Projektstruktur',
        order: 1,
        isRequired: false,
        level: 2
      },
      {
        name: 'Architekturprinzipien',
        order: 2,
        isRequired: false,
        level: 2
      }
    ]
  },
  {
    area: {
      name: 'UI/UX Design',
      order: 300,
      isRequired: false,
      level: 1,
      isArea: true
    },
    sections: [
      {
        name: 'UI-System',
        order: 1,
        isRequired: false,
        level: 2
      },
      {
        name: 'Design-Konventionen',
        order: 2,
        isRequired: false,
        level: 2
      }
    ]
  },
  {
    area: {
      name: 'Sicherheit und Authentifizierung',
      order: 400,
      isRequired: false,
      level: 1,
      isArea: true
    },
    sections: [
      {
        name: 'Security',
        order: 1,
        isRequired: false,
        level: 2
      },
      {
        name: 'Authentifizierung',
        order: 2,
        isRequired: false,
        level: 2
      },
      {
        name: 'Rollenmanagement',
        order: 3,
        isRequired: false,
        level: 2
      }
    ]
  }
];
