import { DetectedSection } from './types';
import { PromptSection } from '@/types/prompt';
import { defaultPromptSections } from '@/core/registry';

// Helper function to normalize names for matching
const normalizeNameForMatching = (name: string): string => {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
};

// Function to determine if a detected section matches a default section
const isSimilarSection = (detected: DetectedSection, defaultSection: any): boolean => {
  const detectedName = normalizeNameForMatching(detected.name);
  const defaultName = normalizeNameForMatching(defaultSection.name);
  
  // Direct name match
  if (detectedName === defaultName) return true;
  
  // Check for keywords in the detected section name
  const keywords = defaultSection.keywords || [];
  if (keywords.some((keyword: string) => detectedName.includes(normalizeNameForMatching(keyword)))) {
    return true;
  }
  
  return false;
};

export const matchWithDefaultSections = (detectedSections: DetectedSection[]): PromptSection[] => {
  const mappedSections: PromptSection[] = [];

  detectedSections.forEach((detected, order) => {
    const normalizedName = normalizeNameForMatching(detected.name);
    
    // Attempt to match with default sections
    let matchedDefault = defaultPromptSections.find(defaultSection => {
      return isSimilarSection(detected, defaultSection);
    });
    
    if (matchedDefault) {
      mappedSections.push({
        id: matchedDefault.id,
        name: detected.name,
        content: detected.content,
        order,
        isRequired: matchedDefault.required,
        level: detected.level ?? 1,
        parentId: detected.parentId ?? undefined,
        isArea: detected.isArea ?? false,
      });
      return;
    }
    
    mappedSections.push({
      id: detected.id || crypto.randomUUID(),
      name: detected.name,
      content: detected.content,
      order,
      isRequired: false,
      level: detected.level ?? 1,
      parentId: detected.parentId ?? undefined,
      isArea: detected.isArea ?? false,
    });
  });

  return mappedSections;
};

// Function to extract content from a section based on a colon delimiter
export const extractContentFromColon = (sectionText: string): { title: string; content: string } => {
  const colonIndex = sectionText.indexOf(':');
  if (colonIndex === -1) {
    return { title: 'Unsorted Content', content: sectionText };
  }

  const title = sectionText.substring(0, colonIndex).trim();
  const content = sectionText.substring(colonIndex + 1).trim();
  return { title, content };
};

// Function to split text into sections based on a specified delimiter
export const splitTextByDelimiter = (text: string, delimiter: string): string[] => {
  return text.split(delimiter).map(section => section.trim()).filter(section => section.length > 0);
};
