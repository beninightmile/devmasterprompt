
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
