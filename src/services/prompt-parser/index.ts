
import { DetectedSection } from './types';
import { matchWithDefaultSections } from './section-matcher';
import { cleanupSectionName, mergeSections } from './section-utils';
import { parseTextIntoSections } from './text-parser';
import { createDefaultAreas, createDefaultSectionForArea } from './factories';
import { DEFAULT_AREAS, STANDARD_SECTIONS } from './constants';

// Re-export everything for backwards compatibility
export { createDefaultAreas, createDefaultSectionForArea, DEFAULT_AREAS, STANDARD_SECTIONS };

// Interface for the detected sections before mapping to PromptSection
export interface DetectedSection {
  name: string;
  content: string;
}

// Export the main parsing functions
export { parseTextIntoSections, matchWithDefaultSections };

// Export all parsers for direct use
export { 
  parseMarkdownHeadings,
  parseNumberedSections,
  parsePrefixedSections,
  parseColonSeparatedSections,
  parseParagraphs,
  parseComplexDocument,
  parseMixedFormatSections,
  parseCombinedFormatSections,
  enhanceHierarchicalStructure,
  cleanupSectionName,
  mergeSections
} from './parsers';

// Export types
export type { DetectedSection };
