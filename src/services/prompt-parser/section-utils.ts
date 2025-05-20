import { DetectedSection } from './types';

/**
 * Clean up section name by removing prefixes and other noise
 */
export function cleanupSectionName(name: string): string {
  // Remove numbered prefixes like "1." or "2.1."
  let cleanName = name.replace(/^\d+\.(\d+\.)*\s+/, '');
  
  // Remove special prefixes like "@Core_1:"
  cleanName = cleanName.replace(/^@[A-Za-z0-9_\-]+:\s*/, '');
  
  // Remove "Block X:" or "Feature X:" type prefixes
  cleanName = cleanName.replace(/^(?:Block|Feature|Core|Section)\s+\d+:?\s*/i, '');
  
  // Capitalize the first letter
  if (cleanName.length > 0) {
    cleanName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
  }
  
  return cleanName;
}

/**
 * Extract hierarchical level information from section name
 */
export function extractLevelFromName(name: string): number {
  // Check for markdown heading level (# to ###### correspond to levels 1-6)
  const headingMatch = name.match(/^(#{1,6})\s+/);
  if (headingMatch) {
    return headingMatch[1].length;
  }
  
  // Check for numbered sections (1., 1.1., 1.1.1., etc.)
  const numberedMatch = name.match(/^(\d+\.)+/);
  if (numberedMatch) {
    // Count the dots to determine depth
    return (numberedMatch[0].match(/\./g) || []).length + 1;
  }
  
  // Check for prefixed sections (@Core_X: etc.)
  const prefixedMatch = name.match(/^@[A-Za-z0-9_\-]+:/);
  if (prefixedMatch) {
    return 1; // Default level for prefixed sections unless otherwise specified
  }
  
  // Default to level 1
  return 1;
}

/**
 * Merge two sets of sections, respecting hierarchical structure
 */
export function mergeSections(existingSections: DetectedSection[], newSections: DetectedSection[]): DetectedSection[] {
  // Create a map of existing sections by ID for quick lookups
  const existingMap = new Map(existingSections.map(section => [section.id!, section]));
  
  // First, update any existing sections with new content
  const updatedExisting = existingSections.map(section => {
    const match = newSections.find(newSection => newSection.id && newSection.id === section.id);
    return match ? { ...section, content: match.content } : section;
  });
  
  // Then add any completely new sections (that don't exist by ID)
  // Make sure to preserve hierarchical information
  const newOnly = newSections.filter(section => !section.id || !existingMap.has(section.id));
  
  // Make sure all sections have IDs
  const processedSections = [...updatedExisting, ...newOnly].map(section => ({
    ...section,
    id: section.id || crypto.randomUUID()
  }));
  
  // Rebuild parent-child relationships for the merged set
  const hierarchicalSections = rebuildHierarchy(processedSections);
  
  // Sort all sections by order or by hierarchical structure
  return sortSectionsByHierarchy(hierarchicalSections);
}

/**
 * Rebuild parent-child relationships in a set of sections
 */
export function rebuildHierarchy(sections: DetectedSection[]): DetectedSection[] {
  // Group sections by their level
  const sectionsByLevel = sections.reduce((acc, section) => {
    const level = section.level || 1;
    if (!acc[level]) acc[level] = [];
    acc[level].push(section);
    return acc;
  }, {} as Record<number, DetectedSection[]>);
  
  // Process sections level by level
  const levels = Object.keys(sectionsByLevel).map(Number).sort();
  
  // Start with top-level sections
  if (levels.length === 0) return sections;
  
  // For each level after the top, find parents
  for (let i = 1; i < levels.length; i++) {
    const currentLevel = levels[i];
    const parentLevel = findClosestParentLevel(levels, currentLevel);
    
    for (const section of sectionsByLevel[currentLevel]) {
      // Try to find an appropriate parent
      if (!section.parentId) {
        section.parentId = findParentId(section, sectionsByLevel[parentLevel]);
      }
    }
  }
  
  return sections;
}

/**
 * Find the closest parent level for a given level
 */
function findClosestParentLevel(levels: number[], currentLevel: number): number {
  // Find the highest level that's lower than the current one
  return Math.max(...levels.filter(l => l < currentLevel));
}

/**
 * Find a parent section for a given section
 */
function findParentId(section: DetectedSection, potentialParents: DetectedSection[]): string | undefined {
  if (!potentialParents || potentialParents.length === 0) return undefined;
  
  // Start from the section before this one and look backwards
  let bestParentIndex = -1;
  
  // Look for sections that appear before this one
  for (let i = potentialParents.length - 1; i >= 0; i--) {
    const parent = potentialParents[i];
    
    // Compare the indices by order if available
    if (section.order !== undefined && parent.order !== undefined && parent.order < section.order) {
      bestParentIndex = i;
      break;
    } else if (bestParentIndex === -1) {
      // If no order is available, use position in the array as fallback
      bestParentIndex = i;
    }
  }
  
  return bestParentIndex >= 0 ? potentialParents[bestParentIndex].id : undefined;
}

/**
 * Sort sections based on their hierarchy and order
 */
export function sortSectionsByHierarchy(sections: DetectedSection[]): DetectedSection[] {
  // First sort by explicit order if available
  const sectionsCopy = [...sections].sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    return 0;
  });
  
  // Then organize by parent-child relationships
  // This is a simplified approach - for complex nested hierarchies,
  // a more sophisticated algorithm may be needed
  return sectionsCopy;
}
