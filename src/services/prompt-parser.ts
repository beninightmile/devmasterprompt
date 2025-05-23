
import { PromptSection } from '@/types/prompt';
import { defaultPromptSections } from '@/core/registry';
import { parseTextIntoSections as parseTextIntoSectionsImpl, 
         matchWithDefaultSections as matchWithDefaultSectionsImpl,
         createDefaultAreas,
         createDefaultSectionForArea,
         DEFAULT_AREAS,
         STANDARD_SECTIONS } from './prompt-parser/index';

// Re-export the functions from prompt-parser/index.ts
export { createDefaultAreas, createDefaultSectionForArea, DEFAULT_AREAS, STANDARD_SECTIONS };

// Interface for the detected sections before mapping to PromptSection
export interface DetectedSection {
  name: string;
  content: string;
}

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
