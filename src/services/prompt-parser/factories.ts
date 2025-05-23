
import { STANDARD_SECTIONS, DEFAULT_AREAS } from './constants';

/**
 * Create default standard sections and area sections
 */
export function createDefaultAreas() {
  // First create the standard sections
  const standardSections = STANDARD_SECTIONS.map(section => ({
    id: crypto.randomUUID(),
    name: section.name,
    content: section.defaultContent,
    order: section.order,
    isRequired: true,
    level: 1,
    isArea: false
  }));

  // Then create the area sections
  const areaSections = DEFAULT_AREAS.map(area => ({
    id: crypto.randomUUID(),
    name: area.name,
    content: area.defaultContent,
    order: area.order,
    isRequired: false,
    level: 1,
    isArea: true
  }));

  // Return combined sections with standard sections first
  return [...standardSections, ...areaSections];
}

/**
 * Create a default section for an area
 */
export function createDefaultSectionForArea(areaId: string, areaName: string) {
  return {
    id: crypto.randomUUID(),
    name: `${areaName.split(':')[0]} - Sektion`,
    content: '',
    order: 1,
    isRequired: false,
    level: 2,
    parentId: areaId
  };
}
