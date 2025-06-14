
/**
 * Core types for the prompt parser system
 */

/**
 * Interface for sections detected during text parsing
 */
export interface DetectedSection {
  id?: string;
  name: string;
  content: string;
  level?: number;
  order?: number;
  parentId?: string | undefined;
  isArea?: boolean;
  isRequired?: boolean; // Added to match PromptSection
  blockPrefix?: string; // For prefixed sections like @@Core_1:
  numberPrefix?: string; // For numbered sections like "1." or "1.1"
}

/**
 * Configuration for parsing different text formats
 */
export interface ParseConfig {
  enableMarkdown?: boolean;
  enableNumbered?: boolean;
  enablePrefixed?: boolean;
  enableColon?: boolean;
  enableParagraph?: boolean;
  prioritizePrefixed?: boolean; // For German @@Core_ sections
}

/**
 * Result of parsing operation
 */
export interface ParseResult {
  sections: DetectedSection[];
  parserUsed: string;
  confidence: number; // 0-1 scale of parsing confidence
}
