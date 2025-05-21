
import React from 'react';
import { PromptSection as PromptSectionType } from '@/types/prompt';
import SectionList from './SectionList';
import { useDragDrop } from './DragDropContext';

interface SectionManagerProps {
  sections: PromptSectionType[];
}

const SectionManager: React.FC<SectionManagerProps> = ({ sections }) => {
  const { draggedSectionId, handleDragStart, handleDragEnd, handleDragOver } = useDragDrop();
  
  return (
    <SectionList 
      sections={sections}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      draggedSectionId={draggedSectionId}
    />
  );
};

export default SectionManager;
