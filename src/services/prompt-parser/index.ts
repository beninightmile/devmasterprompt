
import { DetectedSection } from './types';
import { 
  parseMarkdownHeadings,
  parseNumberedSections,
  parsePrefixedSections,
  parseColonSeparatedSections,
  parseParagraphs
} from './section-parsers';
import { matchWithDefaultSections } from './section-matcher';
import { cleanupSectionName, mergeSections } from './section-utils';

/**
 * Parse free-form text into sections based on various patterns
 */
export function parseTextIntoSections(text: string): DetectedSection[] {
  if (!text || typeof text !== 'string') {
    return [];
  }
  
  // Try different section detection strategies in order of preference
  
  // 1. Try to detect sections based on markdown headings (## Section Name)
  const markdownSections = parseMarkdownHeadings(text);
  if (markdownSections.length > 1) {
    return markdownSections;
  }
  
  // 2. Try to detect numbered sections (1. Section Name or 1.1 Section Name)
  const numberedSections = parseNumberedSections(text);
  if (numberedSections.length > 1) {
    return numberedSections;
  }
  
  // 3. Try to detect special prefixed sections (@Core_1: Section Name)
  const prefixedSections = parsePrefixedSections(text);
  if (prefixedSections.length > 1) {
    return prefixedSections;
  }
  
  // 4. Fall back to looking for colon-separated titles (Section Name: content)
  const colonSections = parseColonSeparatedSections(text);
  if (colonSections.length > 1) {
    return colonSections;
  }
  
  // 5. Fall back to paragraph detection for larger blocks of text
  const paragraphSections = parseParagraphs(text);
  if (paragraphSections.length > 1) {
    return paragraphSections;
  }
  
  // If no sections could be detected, return the entire text as one section
  return [{ name: 'Unsorted Content', content: text.trim() }];
}

export { matchWithDefaultSections, cleanupSectionName, mergeSections };
export type { DetectedSection };
