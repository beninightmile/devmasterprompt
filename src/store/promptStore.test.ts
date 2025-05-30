
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { usePromptStore } from './promptStore';
import { PromptSection } from '@/types/prompt';

// Mock crypto.randomUUID for consistent test results
const mockUUID = '550e8400-e29b-41d4-a716-446655440000' as `${string}-${string}-${string}-${string}-${string}`;
vi.spyOn(crypto, 'randomUUID').mockReturnValue(mockUUID);

describe('PromptStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset store state before each test
    usePromptStore.setState({
      sections: [],
      activeSectionId: null,
      templateName: '',
    });
  });

  it('should be able to add sections', () => {
    const { addSection } = usePromptStore.getState();
    
    const newSection: Omit<PromptSection, 'order'> = {
      id: 'test-section-1',
      name: 'Test Section',
      content: 'This is a test section.',
      level: 1,
      isArea: false,
    };

    addSection(newSection);

    const { sections } = usePromptStore.getState();
    expect(sections).toHaveLength(1);
    expect(sections[0].name).toBe('Test Section');
    expect(sections[0].content).toBe('This is a test section.');
    expect(sections[0].order).toBe(0);
    expect(sections[0].level).toBe(1);
    expect(sections[0].isArea).toBe(false);
  });

  it('should be able to add areas', () => {
    const { addArea } = usePromptStore.getState();
    
    const newArea: Omit<PromptSection, 'order' | 'isArea'> = {
      id: 'test-area-1',
      name: 'Test Area',
      content: 'This is a test area.',
      level: 1,
    };

    addArea(newArea);

    const { sections } = usePromptStore.getState();
    expect(sections).toHaveLength(1);
    expect(sections[0].name).toBe('Test Area');
    expect(sections[0].content).toBe('This is a test area.');
    expect(sections[0].isArea).toBe(true);
    expect(sections[0].level).toBe(1);
  });

  it('should be able to set template name', () => {
    const { setTemplateName } = usePromptStore.getState();
    
    setTemplateName('My Custom Template');

    const { templateName } = usePromptStore.getState();
    expect(templateName).toBe('My Custom Template');
  });

  it('should calculate correct order for nested sections', () => {
    const { addArea, addSection } = usePromptStore.getState();
    
    // Add a parent area first
    const parentArea: Omit<PromptSection, 'order' | 'isArea'> = {
      id: 'parent-area',
      name: 'Parent Area',
      content: 'Parent content',
      level: 1,
    };
    
    addArea(parentArea);
    
    // Add a child section
    const childSection: Omit<PromptSection, 'order'> = {
      id: 'child-section',
      name: 'Child Section',
      content: 'Child content',
      level: 2,
      isArea: false,
    };
    
    addSection(childSection, 'parent-area');

    const { sections } = usePromptStore.getState();
    expect(sections).toHaveLength(2);
    expect(sections[0].order).toBe(0); // Parent area
    expect(sections[1].order).toBe(1); // Child section
    expect(sections[1].parentId).toBe('parent-area');
    expect(sections[1].level).toBe(2);
  });

  it('should remove sections correctly', () => {
    const { addSection, removeSection } = usePromptStore.getState();
    
    // Add two sections
    addSection({
      id: 'section-1',
      name: 'Section 1',
      content: 'Content 1',
      level: 1,
      isArea: false,
    });
    
    addSection({
      id: 'section-2',
      name: 'Section 2',
      content: 'Content 2',
      level: 1,
      isArea: false,
    });

    let { sections } = usePromptStore.getState();
    expect(sections).toHaveLength(2);

    // Remove one section
    removeSection('section-1');

    ({ sections } = usePromptStore.getState());
    expect(sections).toHaveLength(1);
    expect(sections[0].id).toBe('section-2');
  });
});
