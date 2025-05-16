
import type { PromptSection } from '@/types/prompt';

export function generatePromptText(sections: PromptSection[]): string {
  // Sort sections by order
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);
  
  // Generate final prompt text
  return sortedSections
    .filter(section => section.content.trim() !== '')
    .map(section => {
      return `## ${section.name}\n${section.content}\n`;
    })
    .join('\n');
}

export function validatePrompt(sections: PromptSection[]): { isValid: boolean, missingRequired: string[] } {
  const missingRequired = sections
    .filter(section => section.isRequired && section.content.trim() === '')
    .map(section => section.name);
  
  return {
    isValid: missingRequired.length === 0,
    missingRequired
  };
}

export function estimatePromptTokens(text: string): number {
  // Very rough estimate: ~4 characters per token for English text
  return Math.ceil(text.length / 4);
}

export function getNonEmptySectionsCount(sections: PromptSection[]): number {
  return sections.filter(section => section.content.trim() !== '').length;
}
