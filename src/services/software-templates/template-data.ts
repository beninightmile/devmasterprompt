
import { SoftwareTemplate } from './types';
import { createTemplateArea, createStandardSections } from './template-factory';
import { promptEngineeringTemplates } from './prompt-templates';

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
  }
];

// Combine all templates
export const allTemplates: SoftwareTemplate[] = [
  ...softwareTemplates,
  ...promptEngineeringTemplates
];
