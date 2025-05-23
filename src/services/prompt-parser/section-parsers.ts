
// This file now re-exports all parsers from the parsers directory
// for backward compatibility

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

// Also re-export utilities that have moved to section-utils.ts
export { cleanupSectionName, mergeSections, extractLevelFromName } from './section-utils';
