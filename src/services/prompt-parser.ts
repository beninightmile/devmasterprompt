
// Re-export the main functions for backward compatibility
// Fixed circular import by removing self-imports
export { parseTextIntoSections } from './prompt-parser/text-parser';
export { matchWithDefaultSections } from './prompt-parser/section-matcher';
