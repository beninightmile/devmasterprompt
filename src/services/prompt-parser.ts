
import { PromptSection } from '@/types/prompt';
import { parseTextIntoSections as parseTextIntoSectionsImpl, 
         matchWithDefaultSections as matchWithDefaultSectionsImpl,
         createDefaultAreas,
         createDefaultSectionForArea,
         DEFAULT_AREAS,
         STANDARD_SECTIONS,
         DetectedSection } from './prompt-parser/index';

// Re-export the functions from prompt-parser/index.ts
export { createDefaultAreas, createDefaultSectionForArea, DEFAULT_AREAS, STANDARD_SECTIONS };

// Re-export the DetectedSection type
export type { DetectedSection };

/**
 * Parse text input into sections based on various formatting patterns
 * @param text The text to parse into sections
 * @returns Array of detected sections with name and content
 */
export const parseTextIntoSections = parseTextIntoSectionsImpl;

/**
 * Match detected sections with default sections
 * @param detectedSections The detected sections from text parsing
 * @returns Array of PromptSections ready to be added to the store
 */
export const matchWithDefaultSections = matchWithDefaultSectionsImpl;
