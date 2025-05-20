
import { DetectedSection } from './types';
import { 
  parseMarkdownHeadings,
  parseNumberedSections,
  parsePrefixedSections,
  parseColonSeparatedSections,
  parseParagraphs,
  parseComplexDocument,
  parseMixedFormatSections,
  parseCombinedFormatSections
} from './parsers';
import { matchWithDefaultSections } from './section-matcher';
import { cleanupSectionName, mergeSections } from './section-utils';

/**
 * Parse free-form text into sections based on various patterns
 */
export function parseTextIntoSections(text: string): DetectedSection[] {
  if (!text || typeof text !== 'string') {
    return [];
  }
  
  // First try the advanced complex document parser that can handle mixed formats
  const complexSections = parseComplexDocument(text);
  if (complexSections.length > 1) {
    // Assign IDs to sections if they don't have them
    return assignSectionIds(complexSections);
  }
  
  // If the complex parser didn't find enough sections,
  // try the specific combined format parser for documents with mixed section types
  const combinedSections = parseCombinedFormatSections(text);
  if (combinedSections.length > 1) {
    return assignSectionIds(combinedSections);
  }
  
  // If that didn't work, try the individual parsers in order of preference
  
  // 1. Try to detect sections based on markdown headings (## Section Name)
  const markdownSections = parseMarkdownHeadings(text);
  if (markdownSections.length > 1) {
    return assignSectionIds(markdownSections);
  }
  
  // 2. Try to detect numbered sections (1. Section Name or 1.1 Section Name)
  const numberedSections = parseNumberedSections(text);
  if (numberedSections.length > 1) {
    return assignSectionIds(numberedSections);
  }
  
  // 3. Try to detect special prefixed sections (@Core_1: Section Name)
  const prefixedSections = parsePrefixedSections(text);
  if (prefixedSections.length > 1) {
    return assignSectionIds(prefixedSections);
  }
  
  // 4. Fall back to looking for colon-separated titles (Section Name: content)
  const colonSections = parseColonSeparatedSections(text);
  if (colonSections.length > 1) {
    return assignSectionIds(colonSections);
  }
  
  // 5. Fall back to paragraph detection for larger blocks of text
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

export { matchWithDefaultSections, cleanupSectionName, mergeSections };
export type { DetectedSection };
