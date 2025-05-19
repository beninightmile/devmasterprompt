import { DetectedSection } from './types';
import { defaultPromptSections } from '@/core/registry';
import { PromptSection } from '@/types/prompt';

/**
 * Try to match detected sections with default template sections when possible
 */
export function matchWithDefaultSections(detectedSections: DetectedSection[]): PromptSection[] {
  const defaultSectionsMap = new Map(
    defaultPromptSections.map(section => [section.name.toLowerCase(), section])
  );
  
  return detectedSections.map((detectedSection, index) => {
    // Try to find a matching default section
    const matchedDefault = findMatchingDefaultSection(detectedSection.name, defaultSectionsMap);
    
    if (matchedDefault) {
      // If found, use the default section's properties with the detected content
      return {
        id: matchedDefault.id,
        name: matchedDefault.name,
        content: detectedSection.content,
        order: matchedDefault.order,
        isRequired: matchedDefault.isRequired
      };
    } else {
      // Otherwise create a new custom section
      return {
        id: crypto.randomUUID(),
        name: detectedSection.name,
        content: detectedSection.content,
        order: index + defaultPromptSections.length,
        isRequired: false
      };
    }
  });
}

/**
 * Find a matching default section based on name similarity
 */
export function findMatchingDefaultSection(detectedName: string, defaultSectionsMap: Map<string, any>): any | undefined {
  const normalizedName = detectedName.toLowerCase();
  
  // Direct match
  if (defaultSectionsMap.has(normalizedName)) {
    return defaultSectionsMap.get(normalizedName);
  }
  
  // Strip common prefixes for matching
  const strippedName = normalizedName
    .replace(/^(\d+\.|\d+\.\d+\.?)\s+/, '') // Remove numbered prefixes
    .replace(/^@[a-z0-9_\-]+:\s*/i, '');    // Remove @Core_X: type prefixes
  
  if (defaultSectionsMap.has(strippedName)) {
    return defaultSectionsMap.get(strippedName);
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
  
  return undefined;
}
