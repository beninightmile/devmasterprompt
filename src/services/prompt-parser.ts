
// Re-export the main functions for backward compatibility
// Fixed circular import by removing self-imports
export { parseTextIntoSections, matchWithDefaultSections } from './prompt-parser/text-parser';
export { matchWithDefaultSections as sectionMatcher } from './prompt-parser/section-matcher';
