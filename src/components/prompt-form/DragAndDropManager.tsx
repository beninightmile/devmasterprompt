
import React, { useState } from 'react';
import { usePromptStore } from '@/store/promptStore';
import { PromptSection } from '@/types/prompt';

interface DragAndDropManagerProps {
  children: (props: {
    onDragStart: (id: string) => void;
    onDragOver: (id: string) => void;
    onDragEnd: () => void;
    draggedSectionId: string | null;
  }) => React.ReactNode;
}

const DragAndDropManager: React.FC<DragAndDropManagerProps> = ({ children }) => {
  const { sections, reorderSections } = usePromptStore();
  const [draggedSectionId, setDraggedSectionId] = useState<string | null>(null);
  
  const handleDragStart = (id: string) => {
    setDraggedSectionId(id);
  };
  
  const handleDragEnd = () => {
    setDraggedSectionId(null);
  };
  
  const handleDragOver = (id: string) => {
    if (draggedSectionId && draggedSectionId !== id) {
      const currentIds = sections.sort((a, b) => a.order - b.order).map(section => section.id);
      const fromIndex = currentIds.indexOf(draggedSectionId);
      const toIndex = currentIds.indexOf(id);
      if (fromIndex !== -1 && toIndex !== -1) {
        const newOrder = [...currentIds];
        newOrder.splice(fromIndex, 1);
        newOrder.splice(toIndex, 0, draggedSectionId);
        reorderSections(newOrder);
      }
    }
  };

  return children({
    onDragStart: handleDragStart,
    onDragOver: handleDragOver,
    onDragEnd: handleDragEnd,
    draggedSectionId
  });
};

export default DragAndDropManager;
