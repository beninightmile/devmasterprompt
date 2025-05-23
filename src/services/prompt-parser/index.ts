import { DetectedSection } from './types';
import { 
  parseMarkdownHeadings,
  parseNumberedSections,
  parsePrefixedSections,
  parseColonSeparatedSections,
  parseParagraphs,
  parseComplexDocument,
  parseMixedFormatSections,
  parseCombinedFormatSections,
  enhanceHierarchicalStructure
} from './parsers';
import { matchWithDefaultSections } from './section-matcher';
import { cleanupSectionName, mergeSections } from './section-utils';

/**
 * Define standard sections that should appear before areas
 */
export const STANDARD_SECTIONS = [
  {
    id: 'standard_1',
    name: 'Projektname',
    prefix: '@@Standard_1',
    defaultContent: 'Geben Sie hier den Namen des Projekts ein.',
    order: 1,
  },
  {
    id: 'standard_2',
    name: 'Beschreibung',
    prefix: '@@Standard_2',
    defaultContent: 'Beschreiben Sie hier Ihr Projekt in wenigen Sätzen.',
    order: 2,
  },
  {
    id: 'standard_3',
    name: 'Ziel',
    prefix: '@@Standard_3',
    defaultContent: 'Definieren Sie hier das Hauptziel des Projekts.',
    order: 3,
  },
];

/**
 * Define default areas for new prompt
 */
export const DEFAULT_AREAS = [
  {
    id: 'core_1',
    name: 'Technologie-Stack & Tooling',
    prefix: '@@Core_1',
    defaultContent: 'Beschreiben Sie hier den Technologie-Stack und die Tools für Ihr Projekt.',
    order: 10,
  },
  {
    id: 'core_2',
    name: 'Projektstruktur & Architekturprinzipien',
    prefix: '@@Core_2',
    defaultContent: 'Beschreiben Sie hier die Projektstruktur und Architekturprinzipien.',
    order: 20,
  },
  {
    id: 'core_3',
    name: 'UI-System & Design-Konventionen',
    prefix: '@@Core_3',
    defaultContent: 'Beschreiben Sie hier das UI-System und Design-Konventionen.',
    order: 30,
  },
  {
    id: 'core_4',
    name: 'Security, Authentifizierung & Rollenmanagement',
    prefix: '@@Core_4',
    defaultContent: 'Beschreiben Sie hier die Sicherheitsrichtlinien, Authentifizierung und das Rollenmanagement.',
    order: 40,
  },
  {
    id: 'core_5',
    name: 'Standard-Routing & Seitenstruktur',
    prefix: '@@Core_5',
    defaultContent: 'Beschreiben Sie hier das Routing und die Seitenstruktur.',
    order: 50,
  },
  {
    id: 'core_6',
    name: 'Kernmodule & Funktionalitäten (Immer enthalten)',
    prefix: '@@Core_6',
    defaultContent: 'Beschreiben Sie hier die Kernmodule und Funktionalitäten.',
    order: 60,
  },
  {
    id: 'core_7',
    name: 'Admin Control System (ACS) - Systemweit (für Superadmins)',
    prefix: '@@Core_7',
    defaultContent: 'Beschreiben Sie hier das Admin Control System.',
    order: 70,
  },
  {
    id: 'core_8',
    name: 'Codequalität, Testing & CI/CD',
    prefix: '@@Core_8',
    defaultContent: 'Beschreiben Sie hier die Codequalität, Testing und CI/CD.',
    order: 80,
  },
  {
    id: 'core_9',
    name: 'Fehlerbehandlung & Logging-Strategie',
    prefix: '@@Core_9',
    defaultContent: 'Beschreiben Sie hier die Fehlerbehandlung und Logging-Strategie.',
    order: 90,
  },
  {
    id: 'core_10',
    name: 'Performance-Richtlinien',
    prefix: '@@Core_10',
    defaultContent: 'Beschreiben Sie hier die Performance-Richtlinien.',
    order: 100,
  },
  {
    id: 'core_11',
    name: 'Mandantenfähigkeit (Multi-Tenancy) – Design',
    prefix: '@@Core_11',
    defaultContent: 'Beschreiben Sie hier die Mandantenfähigkeit.',
    order: 110,
  },
  {
    id: 'core_12',
    name: 'Compliance & Legal',
    prefix: '@@Core_12',
    defaultContent: 'Beschreiben Sie hier die Compliance- und rechtlichen Anforderungen.',
    order: 120,
  },
  {
    id: 'core_13',
    name: 'DevOps & Observability (Basis)',
    prefix: '@@Core_13',
    defaultContent: 'Beschreiben Sie hier DevOps und Observability.',
    order: 130,
  },
  {
    id: 'core_14',
    name: 'Dokumentationsstandards und Wissenstransfer',
    prefix: '@@Core_14',
    defaultContent: 'Beschreiben Sie hier die Dokumentationsstandards und den Wissenstransfer.',
    order: 140,
  },
];

/**
 * Parse free-form text into sections based on various patterns
 */
export function parseTextIntoSections(text: string): DetectedSection[] {
  if (!text || typeof text !== 'string') {
    return [];
  }
  
  // Try to detect sections with prefixed format first (for areas with @@)
  const prefixedSections = parsePrefixedSections(text);
  if (prefixedSections.length > 0) {
    return assignSectionIds(prefixedSections);
  }
  
  // If no prefixed sections found, try other formats
  const complexSections = parseComplexDocument(text);
  if (complexSections.length > 1) {
    return assignSectionIds(complexSections);
  }
  
  const combinedSections = parseCombinedFormatSections(text);
  if (combinedSections.length > 1) {
    return assignSectionIds(combinedSections);
  }
  
  const markdownSections = parseMarkdownHeadings(text);
  if (markdownSections.length > 1) {
    return assignSectionIds(markdownSections);
  }
  
  const numberedSections = parseNumberedSections(text);
  if (numberedSections.length > 1) {
    return assignSectionIds(numberedSections);
  }
  
  const colonSections = parseColonSeparatedSections(text);
  if (colonSections.length > 1) {
    return assignSectionIds(colonSections);
  }
  
  const paragraphSections = parseParagraphs(text);
  if (paragraphSections.length > 1) {
    return assignSectionIds(paragraphSections);
  }
  
  // If no sections could be detected, return the entire text as one section
  return assignSectionIds([{ 
    name: 'Unsorted Content', 
    content: text.trim(), 
    level: 1,
    order: 0 
  }]);
}

/**
 * Helper function to assign unique IDs to sections
 */
function assignSectionIds(sections: DetectedSection[]): DetectedSection[] {
  return sections.map(section => ({
    ...section,
    id: section.id || crypto.randomUUID()
  }));
}

/**
 * Create default standard sections and area sections
 */
export function createDefaultAreas() {
  // First create the standard sections
  const standardSections = STANDARD_SECTIONS.map(section => ({
    id: crypto.randomUUID(),
    name: section.name,
    content: section.defaultContent,
    order: section.order,
    isRequired: true,
    level: 1,
    isArea: false
  }));

  // Then create the area sections
  const areaSections = DEFAULT_AREAS.map(area => ({
    id: crypto.randomUUID(),
    name: area.name,
    content: area.defaultContent,
    order: area.order,
    isRequired: false,
    level: 1,
    isArea: true
  }));

  // Return combined sections with standard sections first
  return [...standardSections, ...areaSections];
}

/**
 * Create a default section for an area
 */
export function createDefaultSectionForArea(areaId: string, areaName: string) {
  return {
    id: crypto.randomUUID(),
    name: `${areaName.split(':')[0]} - Sektion`,
    content: '',
    order: 1,
    isRequired: false,
    level: 2,
    parentId: areaId
  };
}

export { 
  parseMarkdownHeadings,
  parseNumberedSections,
  parsePrefixedSections,
  parseColonSeparatedSections,
  parseParagraphs,
  parseComplexDocument,
  parseMixedFormatSections,
  parseCombinedFormatSections,
  enhanceHierarchicalStructure,
  matchWithDefaultSections,
  cleanupSectionName,
  mergeSections
};
export type { DetectedSection };
