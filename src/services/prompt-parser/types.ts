
/**
 * Types used by the prompt parser services
 */

export type DetectedSection = {
  id?: string;          // Optional unique identifier (assigned during processing)
  name: string;         // Section title/name
  content: string;      // Section content
  level?: number;       // Hierarchical level (e.g., heading level, numbering depth)
  parentId?: string;    // Reference to parent section for hierarchical structure
  numberPrefix?: string; // For numbered sections like "1.2.3"
  blockPrefix?: string; // For prefixed sections like "@Core_1"
  order?: number;       // Position order for sorting sections
};
