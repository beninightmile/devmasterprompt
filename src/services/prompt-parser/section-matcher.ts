
import { DetectedSection } from './types';
import { defaultPromptSections } from '@/core/registry';
import { PromptSection } from '@/types/prompt';
import { cleanupSectionName } from './section-utils';

/**
 * Try to match detected sections with default template sections when possible
 * Enhanced for German section names and proper area assignment
 */
export function matchWithDefaultSections(detectedSections: DetectedSection[]): PromptSection[] {
  console.log('🔄 Matching sections with defaults:', detectedSections.length);
  
  const defaultSectionsMap = new Map(
    defaultPromptSections.map(section => [section.name.toLowerCase(), section])
  );
  
  // Enhanced German section name mappings with proper area assignments
  const germanMappings = new Map([
    // Standard sections (level 1, no parentId)
    ['projektname', { name: 'Projektname', isStandard: true }],
    ['project name', { name: 'Projektname', isStandard: true }],
    ['kurzbeschreibung', { name: 'Beschreibung', isStandard: true }],
    ['beschreibung', { name: 'Beschreibung', isStandard: true }],
    ['description', { name: 'Beschreibung', isStandard: true }],
    ['zielsetzung und unveränderliche regeln', { name: 'Zielsetzung und unveränderliche Regeln', isStandard: true }],
    ['zielsetzung', { name: 'Zielsetzung und unveränderliche Regeln', isStandard: true }],
    ['ziel', { name: 'Zielsetzung und unveränderliche Regeln', isStandard: true }],
    ['goal', { name: 'Zielsetzung und unveränderliche Regeln', isStandard: true }],
    ['unveränderliche regeln', { name: 'Zielsetzung und unveränderliche Regeln', isStandard: true }],
    ['referenz ui', { name: 'Referenz UI', isStandard: true }],
    ['reference ui', { name: 'Referenz UI', isStandard: true }],
    
    // Technology stack area sections
    ['technologie-stack', { name: 'Technologie-Stack', areaName: 'Technologie Stack und Tooling' }],
    ['technology stack', { name: 'Technologie-Stack', areaName: 'Technologie Stack und Tooling' }],
    ['tech stack', { name: 'Technologie-Stack', areaName: 'Technologie Stack und Tooling' }],
    ['tooling', { name: 'Tooling', areaName: 'Technologie Stack und Tooling' }],
    
    // Architecture area sections
    ['projektstruktur', { name: 'Projektstruktur', areaName: 'Architektur und Standards' }],
    ['project structure', { name: 'Projektstruktur', areaName: 'Architektur und Standards' }],
    ['architekturprinzipien', { name: 'Architekturprinzipien', areaName: 'Architektur und Standards' }],
    ['architecture principles', { name: 'Architekturprinzipien', areaName: 'Architektur und Standards' }],
    
    // UI/UX area sections
    ['ui-system', { name: 'UI-System', areaName: 'UI/UX Design' }],
    ['ui system', { name: 'UI-System', areaName: 'UI/UX Design' }],
    ['design-konventionen', { name: 'Design-Konventionen', areaName: 'UI/UX Design' }],
    ['design conventions', { name: 'Design-Konventionen', areaName: 'UI/UX Design' }],
    
    // Security area sections
    ['security', { name: 'Security', areaName: 'Sicherheit und Authentifizierung' }],
    ['sicherheit', { name: 'Security', areaName: 'Sicherheit und Authentifizierung' }],
    ['authentifizierung', { name: 'Authentifizierung', areaName: 'Sicherheit und Authentifizierung' }],
    ['authentication', { name: 'Authentifizierung', areaName: 'Sicherheit und Authentifizierung' }],
    ['rollenmanagement', { name: 'Rollenmanagement', areaName: 'Sicherheit und Authentifizierung' }],
    ['role management', { name: 'Rollenmanagement', areaName: 'Sicherheit und Authentifizierung' }]
  ]);
  
  const result: PromptSection[] = [];
  const areasToCreate = new Set<string>();
  const areaIds = new Map<string, string>();
  
  // First pass: identify sections and areas needed
  detectedSections.forEach((detectedSection, index) => {
    const cleanName = cleanupSectionName(detectedSection.name);
    const mapping = findGermanMapping(cleanName, germanMappings);
    
    if (mapping && mapping.areaName) {
      areasToCreate.add(mapping.areaName);
    }
  });
  
  // Create areas first
  let currentOrder = 100; // Start areas at order 100
  for (const areaName of areasToCreate) {
    const areaId = crypto.randomUUID();
    areaIds.set(areaName, areaId);
    
    result.push({
      id: areaId,
      name: areaName,
      content: '',
      order: currentOrder,
      isRequired: false,
      level: 1,
      isArea: true
    });
    currentOrder += 100;
  }
  
  // Second pass: create sections with proper area assignments
  let standardOrder = 1;
  let areaChildOrders = new Map<string, number>();
  
  detectedSections.forEach((detectedSection, index) => {
    const cleanName = cleanupSectionName(detectedSection.name);
    const mapping = findGermanMapping(cleanName, germanMappings);
    
    if (mapping) {
      if (mapping.isStandard) {
        // Standard section (level 1, no parentId)
        result.push({
          id: crypto.randomUUID(),
          name: mapping.name,
          content: detectedSection.content,
          order: standardOrder,
          isRequired: false,
          level: 1
        });
        standardOrder += 1;
      } else if (mapping.areaName) {
        // Section belongs to an area
        const areaId = areaIds.get(mapping.areaName);
        if (areaId) {
          const currentAreaOrder = areaChildOrders.get(mapping.areaName) || 1;
          
          result.push({
            id: crypto.randomUUID(),
            name: mapping.name,
            content: detectedSection.content,
            order: currentAreaOrder,
            isRequired: false,
            level: 2,
            parentId: areaId
          });
          
          areaChildOrders.set(mapping.areaName, currentAreaOrder + 1);
        }
      }
    } else {
      // Custom section - create as independent section
      result.push({
        id: crypto.randomUUID(),
        name: cleanName,
        content: detectedSection.content,
        order: standardOrder,
        isRequired: false,
        level: 1
      });
      standardOrder += 1;
    }
  });
  
  console.log(`✅ Created ${result.length} sections with ${areasToCreate.size} areas`);
  return result;
}

/**
 * Find German mapping for a section name
 */
function findGermanMapping(detectedName: string, germanMappings: Map<string, any>): any | undefined {
  const normalizedName = detectedName.toLowerCase();
  
  // Direct match
  if (germanMappings.has(normalizedName)) {
    return germanMappings.get(normalizedName);
  }
  
  // Strip prefixes and try again
  let strippedName = normalizedName
    .replace(/^(\d+\.|\d+\.\d+\.?|\d+\.\d+\.\d+\.?)\s+/, '')
    .replace(/^@@core_\d+:\s*/i, '')
    .replace(/^@@standard_\d+:\s*/i, '')
    .replace(/^@[a-z0-9_\-]+:\s*/i, '')
    .replace(/^(?:block|feature|core|section|standard)\s+\d+:?\s*/i, '');
  
  if (germanMappings.has(strippedName)) {
    return germanMappings.get(strippedName);
  }
  
  // Partial match
  for (const [germanName, mapping] of germanMappings.entries()) {
    if (normalizedName.includes(germanName) || strippedName.includes(germanName)) {
      return mapping;
    }
  }
  
  return undefined;
}

/**
 * Find a matching default section based on name similarity
 */
export function findMatchingDefaultSection(
  detectedName: string, 
  defaultSectionsMap: Map<string, any>,
  germanMappings: Map<string, string>
): any | undefined {
  const normalizedName = detectedName.toLowerCase();
  
  // Direct match
  if (defaultSectionsMap.has(normalizedName)) {
    return defaultSectionsMap.get(normalizedName);
  }
  
  // Check German mappings
  const germanMatch = germanMappings.get(normalizedName);
  if (germanMatch && defaultSectionsMap.has(germanMatch)) {
    return defaultSectionsMap.get(germanMatch);
  }
  
  // Handle numbered sections and prefixed sections
  let strippedName = normalizedName
    .replace(/^(\d+\.|\d+\.\d+\.?|\d+\.\d+\.\d+\.?)\s+/, '')
    .replace(/^@@core_\d+:\s*/i, '')
    .replace(/^@@standard_\d+:\s*/i, '')
    .replace(/^@[a-z0-9_\-]+:\s*/i, '')
    .replace(/^(?:block|feature|core|section|standard)\s+\d+:?\s*/i, '');
  
  if (defaultSectionsMap.has(strippedName)) {
    return defaultSectionsMap.get(strippedName);
  }
  
  return undefined;
}

/**
 * Group sections into a hierarchical structure based on levels and prefixes
 */
export function buildHierarchicalSections(sections: DetectedSection[]): DetectedSection[] {
  const sectionsCopy = [...sections];
  
  sectionsCopy.forEach(section => {
    if (!section.id) {
      section.id = crypto.randomUUID();
    }
  });
  
  let lastSectionAtLevel: Record<number, DetectedSection> = {};
  
  for (const section of sectionsCopy) {
    const level = section.level || 1;
    
    if (level > 1) {
      const potentialParent = lastSectionAtLevel[level - 1];
      if (potentialParent) {
        section.parentId = potentialParent.id;
      }
    }
    
    lastSectionAtLevel[level] = section;
  }
  
  return sectionsCopy;
}
