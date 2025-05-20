
import { DetectedSection } from '../types';
import { parseMarkdownHeadings } from './markdown-parser';
import { parseNumberedSections } from './numbered-parser';
import { parsePrefixedSections } from './prefixed-parser';
import { parseColonSeparatedSections } from './colon-parser';
import { parseParagraphs } from './paragraph-parser';

/**
 * New method: Combine parsing strategies and try to maintain hierarchical structure
 * This method will analyze the text with multiple strategies and choose the best result
 */
export function parseMixedFormatSections(text: string): DetectedSection[] {
  // Try all parsing strategies
  const markdownSections = parseMarkdownHeadings(text);
  const numberedSections = parseNumberedSections(text);
  const prefixedSections = parsePrefixedSections(text);
  const colonSections = parseColonSeparatedSections(text);
  
  // Choose the strategy that detected the most sections
  // Prioritize structured formats over paragraphs
  let bestSections: DetectedSection[] = [];
  let bestSectionCount = 0;
  
  // Check which parser found the most sections
  if (markdownSections.length > bestSectionCount) {
    bestSections = markdownSections;
    bestSectionCount = markdownSections.length;
  }
  
  if (numberedSections.length > bestSectionCount) {
    bestSections = numberedSections;
    bestSectionCount = numberedSections.length;
  }
  
  if (prefixedSections.length > bestSectionCount) {
    bestSections = prefixedSections;
    bestSectionCount = prefixedSections.length;
  }
  
  if (colonSections.length > bestSectionCount) {
    bestSections = colonSections;
    bestSectionCount = colonSections.length;
  }
  
  // If we found sections, return them
  if (bestSectionCount > 1) {
    return bestSections;
  }
  
  // If no structured sections were found, try paragraph parsing as a last resort
  const paragraphSections = parseParagraphs(text);
  if (paragraphSections.length > 1) {
    return paragraphSections;
  }
  
  // If still no sections, return the entire text as one section
  return [{ 
    name: 'Unsorted Content', 
    content: text.trim(),
    level: 1,
    order: 0
  }];
}
