
import { DetectedSection } from './types';
import { defaultPromptSections } from '@/core/registry';
import { PromptSection } from '@/types/prompt';
import { cleanupSectionName } from './section-utils';

/**
 * Try to match detected sections with default template sections when possible
 */
export function matchWithDefaultSections(detectedSections: DetectedSection[]): PromptSection[] {
  const defaultSectionsMap = new Map(
    defaultPromptSections.map(section => [section.name.toLowerCase(), section])
  );
  
  return detectedSections.map((detectedSection, index) => {
    // Clean up the section name for better matching
    const cleanName = cleanupSectionName(detectedSection.name);
    
    // Try to find a matching default section
    const matchedDefault = findMatchingDefaultSection(cleanName, defaultSectionsMap);
    
    if (matchedDefault) {
      // If found, use the default section's properties with the detected content
      return {
        id: matchedDefault.id,
        name: matchedDefault.name,
        content: detectedSection.content,
        order: matchedDefault.order,
        isRequired: matchedDefault.isRequired,
        level: detectedSection.level || 1, // Preserve hierarchical information
        parentId: detectedSection.parentId // Preserve parent reference if available
      };
    } else {
      // Otherwise create a new custom section
      return {
        id: detectedSection.id || crypto.randomUUID(),
        name: cleanName, // Use the cleaned name
        content: detectedSection.content,
        order: index + defaultPromptSections.length,
        isRequired: false,
        level: detectedSection.level || 1, // Preserve hierarchical information
        parentId: detectedSection.parentId // Preserve parent reference if available
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
  
  // Handle numbered sections and prefixed sections
  // Strip common prefixes for matching
  let strippedName = normalizedName
    .replace(/^(\d+\.|\d+\.\d+\.?|\d+\.\d+\.\d+\.?)\s+/, '') // Remove numbered prefixes up to 3 levels
    .replace(/^@[a-z0-9_\-]+:\s*/i, '')    // Remove @Core_X: type prefixes
    .replace(/^(?:block|feature|core|section)\s+\d+:?\s*/i, ''); // Remove "Block N:" prefixes
  
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
