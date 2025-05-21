
import React, { createContext, useState, useContext } from 'react';
import { usePromptStore } from '@/store/promptStore';

interface DragDropContextType {
  draggedSectionId: string | null;
  handleDragStart: (id: string) => void;
  handleDragEnd: () => void;
  handleDragOver: (id: string) => void;
}

const DragDropContext = createContext<DragDropContextType | undefined>(undefined);

export const DragDropProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
  
  return (
    <DragDropContext.Provider value={{ 
      draggedSectionId, 
      handleDragStart, 
      handleDragEnd, 
      handleDragOver 
    }}>
      {children}
    </DragDropContext.Provider>
  );
};

export const useDragDrop = () => {
  const context = useContext(DragDropContext);
  if (context === undefined) {
    throw new Error('useDragDrop must be used within a DragDropProvider');
  }
  return context;
};
