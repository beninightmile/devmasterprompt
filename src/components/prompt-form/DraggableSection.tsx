
import React from 'react';
import { PromptSection as PromptSectionType } from '@/types/prompt';
import PromptSection from '@/components/PromptSection';
import { usePromptStore } from '@/store/promptStore';

interface DraggableSectionProps {
  section: PromptSectionType;
  index: number;
  onMove: (dragIndex: number, hoverIndex: number, dragParentId?: string, hoverParentId?: string) => void;
  parentId?: string;
}

const DraggableSection: React.FC<DraggableSectionProps> = ({
  section,
  index,
  onMove,
  parentId
}) => {
  const { moveSectionToArea } = usePromptStore();
  
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({
      id: section.id,
      index,
      parentId
    }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    
    if (data.id !== section.id) {
      onMove(data.index, index, data.parentId, parentId);
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="transition-all duration-200"
    >
      <PromptSection
        id={section.id}
        name={section.name}
        content={section.content}
        isRequired={section.isRequired}
        level={section.level}
        isArea={section.isArea}
      />
    </div>
  );
};

export default DraggableSection;
