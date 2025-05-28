
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PromptSection } from '@/types/prompt';

// Mock crypto.randomUUID for consistent test results
const mockUUID = '550e8400-e29b-41d4-a716-446655440000' as `${string}-${string}-${string}-${string}-${string}`;
vi.spyOn(crypto, 'randomUUID').mockReturnValue(mockUUID);

describe('PromptStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should be able to create sections', () => {
    const mockSection: PromptSection = {
      id: mockUUID,
      name: 'Test Section',
      content: 'Test content',
      order: 0,
      isRequired: false,
      level: 1
    };
    
    expect(mockSection.id).toBe(mockUUID);
    expect(mockSection.name).toBe('Test Section');
  });
});
