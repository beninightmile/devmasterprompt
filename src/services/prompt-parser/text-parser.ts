
import { DetectedSection } from './types';
import { 
  parseMarkdownHeadings,
  parseNumberedSections,
  parsePrefixedSections,
  parseColonSeparatedSections,
  parseParagraphs,
  parseComplexDocument,
  parseCombinedFormatSections
} from './parsers';

/**
 * Parse free-form text into sections based on various patterns
 * Prioritizes @@Core_ and @@Standard_ prefixed sections for German content
 */
export function parseTextIntoSections(text: string): DetectedSection[] {
  if (!text || typeof text !== 'string') {
    return [];
  }
  
  console.log('🔍 Parsing text into sections, length:', text.length);
  console.log('📝 Text preview:', text.substring(0, 200) + '...');
  
  // PRIORITY 1: Try to detect sections with @@Core_ and @@Standard_ prefixes first
  // This is essential for German Scriptony prompts
  const prefixedSections = parsePrefixedSections(text);
  console.log('🎯 Prefixed sections found:', prefixedSections.length);
  
  if (prefixedSections.length > 0) {
    console.log('✅ Using prefixed sections:', prefixedSections.map(s => s.name));
    return assignSectionIds(prefixedSections);
  }
  
  // PRIORITY 2: Try complex document parsing for mixed formats
  const complexSections = parseComplexDocument(text);
  console.log('📋 Complex sections found:', complexSections.length);
  
  if (complexSections.length > 1) {
    console.log('✅ Using complex document parsing:', complexSections.map(s => s.name));
    return assignSectionIds(complexSections);
  }
  
  // PRIORITY 3: Try combined format sections
  const combinedSections = parseCombinedFormatSections(text);
  console.log('🔗 Combined sections found:', combinedSections.length);
  
  if (combinedSections.length > 1) {
    console.log('✅ Using combined format parsing:', combinedSections.map(s => s.name));
    return assignSectionIds(combinedSections);
  }
  
  // PRIORITY 4: Try markdown headings
  const markdownSections = parseMarkdownHeadings(text);
  console.log('📖 Markdown sections found:', markdownSections.length);
  
  if (markdownSections.length > 1) {
    console.log('✅ Using markdown parsing:', markdownSections.map(s => s.name));
    return assignSectionIds(markdownSections);
  }
  
  // PRIORITY 5: Try numbered sections
  const numberedSections = parseNumberedSections(text);
  console.log('🔢 Numbered sections found:', numberedSections.length);
  
  if (numberedSections.length > 1) {
    console.log('✅ Using numbered parsing:', numberedSections.map(s => s.name));
    return assignSectionIds(numberedSections);
  }
  
  // PRIORITY 6: Try colon-separated sections
  const colonSections = parseColonSeparatedSections(text);
  console.log('❄️ Colon sections found:', colonSections.length);
  
  if (colonSections.length > 1) {
    console.log('✅ Using colon parsing:', colonSections.map(s => s.name));
    return assignSectionIds(colonSections);
  }
  
  // PRIORITY 7: Try paragraph detection
  const paragraphSections = parseParagraphs(text);
  console.log('📄 Paragraph sections found:', paragraphSections.length);
  
  if (paragraphSections.length > 1) {
    console.log('✅ Using paragraph parsing:', paragraphSections.map(s => s.name));
    return assignSectionIds(paragraphSections);
  }
  
  // If no sections could be detected, return the entire text as one section
  console.log('⚠️ No sections detected, using fallback');
  return assignSectionIds([{ 
    name: 'Unsorted Content', 
    content: text.trim(), 
    level: 1,
    order: 0 
  }]);
}

/**
 * Helper function to assign unique IDs to sections
 */
function assignSectionIds(sections: DetectedSection[]): DetectedSection[] {
  return sections.map(section => ({
    ...section,
    id: section.id || crypto.randomUUID()
  }));
}
