
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { parseTextIntoSections } from './text-parser';

// Mock crypto.randomUUID
vi.spyOn(crypto, 'randomUUID').mockReturnValue('mocked-uuid-for-tests' as `${string}-${string}-${string}-${string}-${string}`);

describe('parseTextIntoSections', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should parse simple markdown headings', () => {
    const text = `# Introduction
This is the introduction section.

## Background
This covers the background information.

### Details
Specific details here.`;

    const result = parseTextIntoSections(text);
    
    expect(result).toHaveLength(3);
    expect(result[0].name).toBe('Introduction');
    expect(result[0].content).toContain('This is the introduction section.');
    expect(result[0].level).toBe(1);
    expect(result[1].name).toBe('Background');
    expect(result[1].level).toBe(2);
    expect(result[2].name).toBe('Details');
    expect(result[2].level).toBe(3);
  });

  it('should parse German prefixed sections with @@Core_ and @@Standard_', () => {
    const text = `@@Core_Rolle: Du bist ein AI-Assistent
Beschreibung der Hauptrolle.

@@Standard_Aufgabe: Hilfe bei der Entwicklung
Details zur Standardaufgabe.

@@Core_Kontext: Projektkontext
Wichtige Kontextinformationen.`;

    const result = parseTextIntoSections(text);
    
    expect(result).toHaveLength(3);
    expect(result[0].name).toBe('Rolle');
    expect(result[0].content).toContain('Du bist ein AI-Assistent');
    expect(result[1].name).toBe('Aufgabe');
    expect(result[1].content).toContain('Hilfe bei der Entwicklung');
    expect(result[2].name).toBe('Kontext');
    expect(result[2].content).toContain('Projektkontext');
  });

  it('should parse numbered sections', () => {
    const text = `1. First Section
Content of the first section.

2. Second Section
Content of the second section.

3. Third Section
Content of the third section.`;

    const result = parseTextIntoSections(text);
    
    expect(result).toHaveLength(3);
    expect(result[0].name).toBe('First Section');
    expect(result[0].content).toContain('Content of the first section.');
    expect(result[1].name).toBe('Second Section');
    expect(result[2].name).toBe('Third Section');
  });

  it('should parse colon-separated sections', () => {
    const text = `Role: You are an AI assistant
Help users with their questions.

Task: Process user input
Analyze and respond appropriately.

Context: Development environment
Working on a software project.`;

    const result = parseTextIntoSections(text);
    
    expect(result).toHaveLength(3);
    expect(result[0].name).toBe('Role');
    expect(result[0].content).toContain('You are an AI assistant');
    expect(result[1].name).toBe('Task');
    expect(result[1].content).toContain('Process user input');
    expect(result[2].name).toBe('Context');
    expect(result[2].content).toContain('Development environment');
  });

  it('should handle empty or invalid input gracefully', () => {
    expect(parseTextIntoSections('')).toEqual([]);
    expect(parseTextIntoSections('   ')).toEqual([]);
    
    // Should return single fallback section for unstructured text
    const unstructuredText = 'This is just a plain text without any structure.';
    const result = parseTextIntoSections(unstructuredText);
    
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Unsorted Content');
    expect(result[0].content).toBe(unstructuredText);
    expect(result[0].level).toBe(1);
  });
});
