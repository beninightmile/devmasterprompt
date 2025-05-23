
import { matchWithDefaultSections } from './section-matcher';
import { cleanupSectionName, mergeSections } from './section-utils';
import { parseTextIntoSections } from './text-parser';
import { createDefaultAreas, createDefaultSectionForArea } from './factories';
import { DEFAULT_AREAS, STANDARD_SECTIONS } from './constants';
import { DetectedSection } from './types';

// Re-export everything for backwards compatibility
export { createDefaultAreas, createDefaultSectionForArea, DEFAULT_AREAS, STANDARD_SECTIONS };

// Export the main parsing functions
export { parseTextIntoSections, matchWithDefaultSections };

// Export utilities
export { cleanupSectionName, mergeSections };

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
  enhanceHierarchicalStructure
} from './parsers';

// Export types
export type { DetectedSection };
