
import React from 'react';
import PromptSection from '@/components/PromptSection';
import { PromptSection as PromptSectionType } from '@/types/prompt';

interface SectionListProps {
  sections: PromptSectionType[];
  onDragOver: (id: string) => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  draggedSectionId?: string | null;
}

const SectionList: React.FC<SectionListProps> = ({
  sections,
  onDragOver,
  onDragStart,
  onDragEnd,
  draggedSectionId,
}) => {
  // Sort sections by order
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      {sortedSections.map(section => (
        <div 
          key={section.id} 
          onDragOver={() => onDragOver(section.id)}
          className={section.level && section.level > 1 
            ? `ml-${Math.min(section.level - 1, 5) * 4}` // Indent based on level, max 5 levels deep
            : ''}
        >
          <PromptSection 
            id={section.id} 
            name={section.name} 
            content={section.content} 
            isRequired={section.isRequired}
            level={section.level}
            isDragging={section.id === draggedSectionId}
            onDragStart={() => onDragStart(section.id)}
            onDragEnd={onDragEnd}
          />
        </div>
      ))}
    </div>
  );
};

export default SectionList;
