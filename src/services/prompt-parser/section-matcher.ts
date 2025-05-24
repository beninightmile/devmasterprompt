
import { DetectedSection } from './types';
import { defaultPromptSections } from '@/core/registry';
import { PromptSection } from '@/types/prompt';
import { cleanupSectionName } from './section-utils';

/**
 * Try to match detected sections with default template sections when possible
 * Enhanced for German section names and @@Core_ prefixes
 */
export function matchWithDefaultSections(detectedSections: DetectedSection[]): PromptSection[] {
  console.log('🔄 Matching sections with defaults:', detectedSections.length);
  
  const defaultSectionsMap = new Map(
    defaultPromptSections.map(section => [section.name.toLowerCase(), section])
  );
  
  // Enhanced German section name mappings
  const germanMappings = new Map([
    ['projektname', 'project name'],
    ['kurzbeschreibung', 'description'],
    ['beschreibung', 'description'],
    ['zielsetzung und unveränderliche regeln', 'goal'],
    ['ziel', 'zielsetzung und unveränderliche regeln'], // Map old 'ziel' to new compound name
    ['zielsetzung', 'zielsetzung und unveränderliche regeln'],
    ['unveränderliche regeln', 'zielsetzung und unveränderliche regeln'],
    ['referenz ui', 'referenz ui'], // New standalone section
    ['technologie-stack', 'technology stack'],
    ['tooling', 'tooling'],
    ['projektstruktur', 'project structure'],
    ['architekturprinzipien', 'architecture principles'],
    ['ui-system', 'ui system'],
    ['design-konventionen', 'design conventions'],
    ['security', 'security'],
    ['authentifizierung', 'authentication'],
    ['rollenmanagement', 'role management']
  ]);
  
  return detectedSections.map((detectedSection, index) => {
    console.log(`📝 Processing section: "${detectedSection.name}"`);
    
    // Clean up the section name for better matching
    const cleanName = cleanupSectionName(detectedSection.name);
    
    // Special handling for specific German sections
    let finalName = cleanName;
    
    // Handle the special case where we want to rename sections
    if (cleanName.toLowerCase() === 'projektname') {
      finalName = 'Projektname';
    } else if (cleanName.toLowerCase() === 'kurzbeschreibung' || cleanName.toLowerCase() === 'beschreibung') {
      finalName = 'Beschreibung';
    } else if (cleanName.toLowerCase().includes('zielsetzung') || cleanName.toLowerCase().includes('ziel')) {
      finalName = 'Zielsetzung und unveränderliche Regeln';
    } else if (cleanName.toLowerCase().includes('referenz ui')) {
      finalName = 'Referenz UI';
    }
    
    // Try to find a matching default section
    const matchedDefault = findMatchingDefaultSection(
      cleanName, 
      defaultSectionsMap, 
      germanMappings
    );
    
    if (matchedDefault) {
      console.log(`✅ Matched "${cleanName}" to default section "${matchedDefault.name}"`);
      // If found, use the default section's properties with the detected content
      return {
        id: matchedDefault.id,
        name: finalName || matchedDefault.name,
        content: detectedSection.content,
        order: matchedDefault.order,
        isRequired: matchedDefault.isRequired,
        level: detectedSection.level || 1,
        parentId: detectedSection.parentId,
        isArea: detectedSection.isArea
      };
    } else {
      console.log(`🆕 Creating new custom section for "${cleanName}"`);
      // Otherwise create a new custom section
      return {
        id: detectedSection.id || crypto.randomUUID(),
        name: finalName,
        content: detectedSection.content,
        order: detectedSection.order || (index + defaultPromptSections.length),
        isRequired: false,
        level: detectedSection.level || 1,
        parentId: detectedSection.parentId,
        isArea: detectedSection.isArea || false
      };
    }
  });
}

/**
 * Find a matching default section based on name similarity
 * Enhanced for German content and @@Core_ prefixes
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
  // Strip common prefixes for matching
  let strippedName = normalizedName
    .replace(/^(\d+\.|\d+\.\d+\.?|\d+\.\d+\.\d+\.?)\s+/, '') // Remove numbered prefixes up to 3 levels
    .replace(/^@@core_\d+:\s*/i, '')    // Remove @@Core_X: type prefixes
    .replace(/^@@standard_\d+:\s*/i, '') // Remove @@Standard_X: type prefixes
    .replace(/^@[a-z0-9_\-]+:\s*/i, '')    // Remove @Other_X: type prefixes
    .replace(/^(?:block|feature|core|section|standard)\s+\d+:?\s*/i, ''); // Remove "Block N:" prefixes
  
  if (defaultSectionsMap.has(strippedName)) {
    return defaultSectionsMap.get(strippedName);
  }
  
  // Check German mappings for stripped name
  const germanStrippedMatch = germanMappings.get(strippedName);
  if (germanStrippedMatch && defaultSectionsMap.has(germanStrippedMatch)) {
    return defaultSectionsMap.get(germanStrippedMatch);
  }
  
  // Partial match - check if any default section name is contained in the detected name
  for (const [defaultName, section] of defaultSectionsMap.entries()) {
    if (normalizedName.includes(defaultName) || 
        defaultName.includes(normalizedName) ||
        strippedName.includes(defaultName) ||
        defaultName.includes(strippedName)) {
      return section;
    }
  }
  
  // Check German mappings for partial matches
  for (const [germanName, englishName] of germanMappings.entries()) {
    if (normalizedName.includes(germanName) || strippedName.includes(germanName)) {
      if (defaultSectionsMap.has(englishName)) {
        return defaultSectionsMap.get(englishName);
      }
    }
  }
  
  // Try matching by checking if the stripped section name is semantically similar to any default section
  // This is a more aggressive matching approach for complex prefixes
  for (const [defaultName, section] of defaultSectionsMap.entries()) {
    // Get the important words from both names
    const defaultKeywords = defaultName.split(/\s+/).filter(word => word.length > 3);
    const detectedKeywords = strippedName.split(/\s+/).filter(word => word.length > 3);
    
    // Check if there's a significant keyword overlap
    const sharedKeywords = defaultKeywords.filter(keyword => 
      detectedKeywords.some(detectedWord => 
        detectedWord.includes(keyword) || keyword.includes(detectedWord)
      )
    );
    
    if (sharedKeywords.length > 0 && sharedKeywords.length >= Math.min(1, Math.floor(defaultKeywords.length / 2))) {
      return section;
    }
  }
  
  return undefined;
}

/**
 * Group sections into a hierarchical structure based on levels and prefixes
 */
export function buildHierarchicalSections(sections: DetectedSection[]): DetectedSection[] {
  // Clone the sections to avoid modifying the original
  const sectionsCopy = [...sections];
  
  // First assign proper IDs if missing
  sectionsCopy.forEach(section => {
    if (!section.id) {
      section.id = crypto.randomUUID();
    }
  });
  
  // Now build parent-child relationships
  let lastSectionAtLevel: Record<number, DetectedSection> = {};
  
  for (const section of sectionsCopy) {
    const level = section.level || 1;
    
    // If this isn't a top-level section, find its parent
    if (level > 1) {
      // Look for a section at the previous level
      const potentialParent = lastSectionAtLevel[level - 1];
      if (potentialParent) {
        section.parentId = potentialParent.id;
      }
    }
    
    // Update the last section seen at this level
    lastSectionAtLevel[level] = section;
  }
  
  return sectionsCopy;
}
