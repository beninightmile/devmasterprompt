import { DetectedSection, ParseResult } from '../types';
import { createDetectedSection } from '../section-utils';
import { parseMarkdownHeadings } from './markdown-parser';
import { parseNumberedSections } from './numbered-parser';
import { parsePrefixedSections } from './prefixed-parser';
import { parseColonSeparatedSections } from './colon-parser';
import { parseParagraphs } from './paragraph-parser';
import { parseMixedFormatSections } from './mixed-format-parser';
import { parseCombinedFormatSections } from './combined-format-parser';

/**
 * Advanced parse that attempts to recognize complex documents with mixed formatting
 * This uses a hybrid approach and retains hierarchical information
 */
export function parseComplexDocument(text: string): DetectedSection[] {
  // First, try the new combined format parser which handles mixed formats
  const combinedSections = parseCombinedFormatSections(text);
  if (combinedSections.length > 1) {
    // Post-process to enhance the structure
    enhanceHierarchicalStructure(combinedSections);
    return combinedSections;
  }
  
  // If the combined parser didn't find enough sections, 
  // try all parsers and merge their results by position
  const allSections: DetectedSection[] = [];
  
  // Add sections from all parsers
  allSections.push(...parseMarkdownHeadings(text)
    .filter(section => section.content.trim()));
  allSections.push(...parseNumberedSections(text)
    .filter(section => section.content.trim()));
  allSections.push(...parsePrefixedSections(text)
    .filter(section => section.content.trim()));
  
  // If we've found multiple sections from different parsers
  if (allSections.length > 1) {
    // Sort sections by their position in the document (order property)
    allSections.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      return 0;
    });
    
    // Deduplicate sections that might overlap
    const dedupedSections = deduplicateSections(allSections);
    
    // Build parent-child relationships
    enhanceHierarchicalStructure(dedupedSections);
    
    return dedupedSections;
  }
  
  // If we still don't have a good result, fall back to the mixed format parser
  const mixedSections = parseMixedFormatSections(text);
  if (mixedSections.length > 1) {
    enhanceHierarchicalStructure(mixedSections);
    return mixedSections;
  }
  
  // Last resort: try colon sections and paragraphs
  const colonSections = parseColonSeparatedSections(text);
  if (colonSections.length > 1) {
    enhanceHierarchicalStructure(colonSections);
    return colonSections;
  }
  
  const paragraphSections = parseParagraphs(text);
  if (paragraphSections.length > 1) {
    return paragraphSections;
  }
  
  // If nothing worked, return the text as one section
  return [{ 
    name: 'Unsorted Content', 
    content: text.trim(),
    level: 1,
    order: 0
  }];
}

/**
 * Helper to deduplicate sections that might overlap (from different parsers)
 */
function deduplicateSections(sections: DetectedSection[]): DetectedSection[] {
  // Sort by order first to ensure we keep the earliest occurrence
  sections.sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    return 0;
  });
  
  // Use a map to track content we've seen
  const contentFingerprints = new Map<string, boolean>();
  const dedupedSections: DetectedSection[] = [];
  
  for (const section of sections) {
    // Create a simple fingerprint of the content (first 50 chars)
    const contentStart = section.content.trim().slice(0, 50);
    
    // If we haven't seen this content before, keep this section
    if (!contentFingerprints.has(contentStart)) {
      contentFingerprints.set(contentStart, true);
      dedupedSections.push(section);
    }
  }
  
  return dedupedSections;
}

/**
 * Helper function to enhance the hierarchical structure of sections
 * This modifies the sections array in place
 */
export function enhanceHierarchicalStructure(sections: DetectedSection[]): void {
  // Ensure all sections have a level property
  sections.forEach(section => {
    if (section.level === undefined) {
      section.level = 1;
    }
  });
  
  // Try to detect parent-child relationships
  for (let i = 0; i < sections.length; i++) {
    const currentSection = sections[i];
    const nextSection = i < sections.length - 1 ? sections[i + 1] : null;
    
    if (nextSection && currentSection.level && nextSection.level) {
      // If the next section has a deeper level, mark the relationship
      if (nextSection.level > currentSection.level) {
        nextSection.parentId = currentSection.id;
      }
      // If they're at the same level, they share the same parent
      else if (nextSection.level === currentSection.level && currentSection.parentId) {
        nextSection.parentId = currentSection.parentId;
      }
      // If the next section is at a higher level than this one, we need to find an appropriate parent
      else if (nextSection.level < currentSection.level && i > 0) {
        // Look backwards to find the appropriate parent at this level
        for (let j = i - 1; j >= 0; j--) {
          if (sections[j].level === nextSection.level) {
            if (sections[j].parentId) {
              nextSection.parentId = sections[j].parentId;
            }
            break;
          } else if (sections[j].level < nextSection.level) {
            nextSection.parentId = sections[j].id;
            break;
          }
        }
      }
    }
  }
}

const processSection = (name: string, content: string, level: number): DetectedSection => {
  return createDetectedSection(
    name || 'Untitled Section',
    content || '',
    level
  );
};
