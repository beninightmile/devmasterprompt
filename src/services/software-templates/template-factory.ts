
import { PromptSection } from '@/types/prompt';
import { STANDARD_SECTIONS } from '../prompt-parser/constants';

// Helper function to create an area with children
export const createTemplateArea = (areaProps: {
  id: string;
  name: string;
  content?: string;
  order: number;
  children?: Array<{
    name: string;
    content: string;
    isRequired?: boolean;
  }>;
}): PromptSection[] => {
  const { id, name, content = '', order, children = [] } = areaProps;
  
  // Create the area
  const area: PromptSection = {
    id,
    name,
    content,
    order,
    isRequired: false,
    level: 1,
    isArea: true
  };
  
  // Create child sections
  const childSections = children.map((child, index) => ({
    id: `${id}-child-${index}`,
    name: child.name,
    content: child.content,
    order: order + index + 1,
    isRequired: child.isRequired || false,
    level: 2,
    parentId: id
  }));
  
  return [area, ...childSections];
};

// Helper function to create standard sections
export const createStandardSections = (): PromptSection[] => {
  return STANDARD_SECTIONS.map((section, index) => ({
    id: `standard-${section.id}`,
    name: section.name,
    content: section.defaultContent,
    order: index + 1,
    isRequired: true,
    level: 1
  }));
};
