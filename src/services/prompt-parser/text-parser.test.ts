
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { parseTextIntoSections } from './text-parser';

// Mock crypto.randomUUID
vi.spyOn(crypto, 'randomUUID').mockReturnValue('mocked-uuid-for-tests' as `${string}-${string}-${string}-${string}-${string}`);

describe('parseTextIntoSections', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should parse simple markdown headings', () => {
    const input = `# Role
You are a helpful assistant.

# Task
Complete the given task.

# Output
Provide clear output.`;

    const result = parseTextIntoSections(input);
    
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual(
      expect.objectContaining({
        name: 'Role',
        content: 'You are a helpful assistant.',
        level: 1,
        id: 'mocked-uuid-for-tests'
      })
    );
    expect(result[1]).toEqual(
      expect.objectContaining({
        name: 'Task',
        content: 'Complete the given task.',
        level: 1
      })
    );
    expect(result[2]).toEqual(
      expect.objectContaining({
        name: 'Output',
        content: 'Provide clear output.',
        level: 1
      })
    );
  });

  it('should parse numbered sections', () => {
    const input = `1. First Section
This is the first section content.

2. Second Section
This is the second section content.

3. Third Section
This is the third section content.`;

    const result = parseTextIntoSections(input);
    
    expect(result).toHaveLength(3);
    expect(result[0].name).toBe('First Section');
    expect(result[0].content).toBe('This is the first section content.');
    expect(result[1].name).toBe('Second Section');
    expect(result[2].name).toBe('Third Section');
  });

  it('should parse prefixed sections with @@Core_ and @@Standard_', () => {
    const input = `@@Core_1: System Role
You are an AI assistant.

@@Standard_2: Instructions
Follow these instructions carefully.

@@Core_3: Context
Use this context for responses.`;

    const result = parseTextIntoSections(input);
    
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual(
      expect.objectContaining({
        name: 'System Role',
        content: 'You are an AI assistant.',
        level: 1
      })
    );
    expect(result[1]).toEqual(
      expect.objectContaining({
        name: 'Instructions',
        content: 'Follow these instructions carefully.',
        level: 1
      })
    );
    expect(result[2]).toEqual(
      expect.objectContaining({
        name: 'Context',
        content: 'Use this context for responses.',
        level: 1
      })
    );
  });

  it('should parse mixed format sections', () => {
    const input = `# Main Heading
This is a markdown heading.

1. Numbered Item
This is a numbered section.

@@Core_1: Prefixed Section
This is a prefixed section.

## Sub Heading
This is a sub heading.`;

    const result = parseTextIntoSections(input);
    
    expect(result.length).toBeGreaterThan(0);
    expect(result.some(section => section.name === 'Main Heading')).toBe(true);
  });

  it('should handle empty or invalid input', () => {
    expect(parseTextIntoSections('')).toEqual([
      expect.objectContaining({
        name: 'Unsorted Content',
        content: '',
        level: 1,
        order: 0,
        id: 'mocked-uuid-for-tests'
      })
    ]);

    expect(parseTextIntoSections('   \n\n  ')).toEqual([
      expect.objectContaining({
        name: 'Unsorted Content',
        content: '',
        level: 1,
        order: 0
      })
    ]);

    expect(parseTextIntoSections('Just plain text without structure')).toEqual([
      expect.objectContaining({
        name: 'Unsorted Content',
        content: 'Just plain text without structure',
        level: 1,
        order: 0
      })
    ]);
  });
});
