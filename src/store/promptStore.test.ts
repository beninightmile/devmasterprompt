
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { usePromptStore } from './promptStore';

// Mock crypto.randomUUID
vi.spyOn(crypto, 'randomUUID').mockReturnValue('mocked-uuid');

describe('promptStore', () => {
  beforeEach(() => {
    // Reset store before each test
    usePromptStore.setState({
      sections: [],
      activeSectionId: null,
      inspirationItems: [],
      isPreviewMode: false,
      templateName: '',
      currentTemplateId: null,
      autoSaveEnabled: false,
      autoSaveInterval: 5,
      lastSaveTime: null,
      ideas: [],
    });
    vi.clearAllMocks();
  });

  it('should add a standard section (level 1)', () => {
    const { addSection } = usePromptStore.getState();
    
    const newSection = {
      id: 'test-id',
      name: 'Test Section',
      content: 'Test content',
      isRequired: false,
    };

    addSection(newSection);

    const { sections } = usePromptStore.getState();
    expect(sections).toHaveLength(1);
    expect(sections[0]).toEqual(
      expect.objectContaining({
        id: 'test-id',
        name: 'Test Section',
        content: 'Test content',
        isRequired: false,
        order: expect.any(Number),
        level: 1,
      })
    );
  });

  it('should add an area and create initial child section', () => {
    const { addArea } = usePromptStore.getState();
    
    const newArea = {
      id: 'area-id',
      name: 'Test Area',
      content: 'Area description',
      isRequired: false,
    };

    addArea(newArea);

    const { sections } = usePromptStore.getState();
    expect(sections).toHaveLength(2); // Area + initial child section
    
    const area = sections.find(s => s.isArea);
    const childSection = sections.find(s => s.parentId === 'area-id');
    
    expect(area).toEqual(
      expect.objectContaining({
        id: 'area-id',
        name: 'Test Area',
        content: 'Area description',
        isArea: true,
        level: 1,
      })
    );
    
    expect(childSection).toEqual(
      expect.objectContaining({
        name: 'Neue Sektion',
        content: '',
        parentId: 'area-id',
        level: 2,
        isRequired: false,
      })
    );
  });

  it('should set template name', () => {
    const { setTemplateName } = usePromptStore.getState();
    
    setTemplateName('My Test Template');
    
    const { templateName } = usePromptStore.getState();
    expect(templateName).toBe('My Test Template');
  });

  it('should update section content', () => {
    const { addSection, updateSection } = usePromptStore.getState();
    
    // First add a section
    addSection({
      id: 'test-section',
      name: 'Test Section',
      content: 'Initial content',
      isRequired: false,
    });

    // Then update it
    updateSection('test-section', {
      content: 'Updated content',
      name: 'Updated Section Name'
    });

    const { sections } = usePromptStore.getState();
    const updatedSection = sections.find(s => s.id === 'test-section');
    
    expect(updatedSection).toEqual(
      expect.objectContaining({
        id: 'test-section',
        name: 'Updated Section Name',
        content: 'Updated content',
        isRequired: false,
      })
    );
  });

  it('should remove section correctly', () => {
    const { addSection, removeSection } = usePromptStore.getState();
    
    // Add two sections
    addSection({
      id: 'section-1',
      name: 'Section 1',
      content: 'Content 1',
      isRequired: false,
    });
    
    addSection({
      id: 'section-2',
      name: 'Section 2',
      content: 'Content 2',
      isRequired: false,
    });

    // Remove one section
    removeSection('section-1');

    const { sections } = usePromptStore.getState();
    expect(sections).toHaveLength(1);
    expect(sections[0].id).toBe('section-2');
  });
});
