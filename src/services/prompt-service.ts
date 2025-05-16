
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
  // A more accurate token estimate than simple character division
  // English text averages around 4 chars per token (but varies with content type)
  // This is still an estimate; for exact counts, a proper tokenizer would be needed
  
  if (!text) return 0;
  
  // Count whitespace more efficiently (whitespace usually shares tokens)
  const strippedWhitespace = text.replace(/\s+/g, ' ');
  
  // Special characters (like code symbols) often get their own tokens
  const specialCharCount = (text.match(/[^\w\s]/g) || []).length;
  
  // Base calculation with adjustment for special characters
  const baseCount = Math.ceil(strippedWhitespace.length / 4);
  const adjustedCount = baseCount + Math.floor(specialCharCount * 0.5);
  
  return adjustedCount;
}

export function estimateSectionTokens(section: PromptSection): number {
  if (!section.content) return 0;
  
  // Include the section name in token count (# SectionName adds tokens too)
  const titleTokens = estimatePromptTokens(`## ${section.name}`);
  const contentTokens = estimatePromptTokens(section.content);
  
  return titleTokens + contentTokens;
}

export function getModelCompatibility(tokenCount: number): {
  model: string;
  isCompatible: boolean;
  maxTokens: number;
}[] {
  // Common AI model token limits (as of May 2025)
  const models = [
    { model: "GPT-3.5", isCompatible: tokenCount <= 16000, maxTokens: 16000 },
    { model: "GPT-4o", isCompatible: tokenCount <= 128000, maxTokens: 128000 },
    { model: "Claude 3 Opus", isCompatible: tokenCount <= 200000, maxTokens: 200000 },
    { model: "Gemini Pro", isCompatible: tokenCount <= 32000, maxTokens: 32000 },
  ];
  
  return models;
}

export function getNonEmptySectionsCount(sections: PromptSection[]): number {
  return sections.filter(section => section.content.trim() !== '').length;
}
