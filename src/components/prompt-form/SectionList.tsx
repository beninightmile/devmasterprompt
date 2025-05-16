
import React, { useState } from 'react';
import PromptSection from '@/components/PromptSection';
import { PromptSection as PromptSectionType } from '@/types/prompt';

interface SectionListProps {
  sections: PromptSectionType[];
  onDragOver: (id: string) => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
}

const SectionList: React.FC<SectionListProps> = ({
  sections,
  onDragOver,
  onDragStart,
  onDragEnd,
}) => {
  const [draggedSectionId, setDraggedSectionId] = useState<string | null>(null);

  const handleDragStart = (id: string) => {
    setDraggedSectionId(id);
    onDragStart(id);
  };

  const handleDragEnd = () => {
    setDraggedSectionId(null);
    onDragEnd();
  };

  // Sort sections by order
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      {sortedSections.map(section => (
        <div key={section.id} onDragOver={() => onDragOver(section.id)}>
          <PromptSection 
            id={section.id} 
            name={section.name} 
            content={section.content} 
            isRequired={section.isRequired}
            isDragging={section.id === draggedSectionId}
            onDragStart={() => handleDragStart(section.id)}
            onDragEnd={handleDragEnd}
          />
        </div>
      ))}
    </div>
  );
};

export default SectionList;
