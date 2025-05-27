
import { DetectedSection } from '../types';

// Function to parse complex documents with mixed formats
export function parseComplexDocument(text: string): DetectedSection[] {
  const sections: DetectedSection[] = [];
  const lines = text.split('\n');
  let currentSection: DetectedSection | null = null;
  let sectionContent: string[] = [];
  let order = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check for various section patterns
    if (isNewSection(line)) {
      // Save previous section
      if (currentSection) {
        currentSection.content = sectionContent.join('\n').trim();
        sections.push(currentSection);
      }
      
      // Start new section
      const sectionName = extractSectionName(line);
      const level = extractLevelFromLine(line);
      
      currentSection = {
        name: sectionName,
        content: '',
        level,
        order: order++,
        id: crypto.randomUUID()
      };
      
      sectionContent = [];
    } else if (currentSection && line.length > 0) {
      // Add content to current section
      sectionContent.push(line);
    }
  }
  
  // Save last section
  if (currentSection) {
    currentSection.content = sectionContent.join('\n').trim();
    sections.push(currentSection);
  }
  
  return sections;
}

function isNewSection(line: string): boolean {
  // Check for markdown headings
  if (/^#{1,6}\s+/.test(line)) return true;
  
  // Check for numbered lists
  if (/^\d+\.\s+/.test(line)) return true;
  
  // Check for prefixed sections
  if (/^@@(Core|Standard)_\d+:\s*/.test(line)) return true;
  
  // Check for colon-separated sections
  if (/^[A-Z][^:]*:\s*/.test(line)) return true;
  
  return false;
}

function extractSectionName(line: string): string {
  // Extract from markdown headings
  const markdownMatch = line.match(/^#{1,6}\s+(.+)$/);
  if (markdownMatch) return markdownMatch[1].trim();
  
  // Extract from numbered lists
  const numberedMatch = line.match(/^\d+\.\s+(.+)$/);
  if (numberedMatch) return numberedMatch[1].trim();
  
  // Extract from prefixed sections
  const prefixedMatch = line.match(/^@@(?:Core|Standard)_\d+:\s*(.+)$/);
  if (prefixedMatch) return prefixedMatch[1].trim();
  
  // Extract from colon-separated
  const colonMatch = line.match(/^([^:]+):\s*(.*)$/);
  if (colonMatch) return colonMatch[1].trim();
  
  return line.trim();
}

function extractLevelFromLine(line: string): number {
  // Markdown heading level
  const markdownMatch = line.match(/^(#{1,6})\s+/);
  if (markdownMatch) return markdownMatch[1].length;
  
  // Default level
  return 1;
}

export function enhanceHierarchicalStructure(sections: DetectedSection[]): DetectedSection[] {
  const enhancedSections: DetectedSection[] = [];
  const parentStack: DetectedSection[] = [];
  
  for (const section of sections) {
    const level = section.level ?? 1;
    
    // Find the appropriate parent
    while (parentStack.length > 0 && (parentStack[parentStack.length - 1].level ?? 1) >= level) {
      parentStack.pop();
    }
    
    const parentSection = parentStack[parentStack.length - 1];
    const enhancedSection: DetectedSection = {
      ...section,
      level,
      parentId: parentSection?.id || undefined
    };
    
    enhancedSections.push(enhancedSection);
    parentStack.push(enhancedSection);
  }
  
  return enhancedSections;
}
