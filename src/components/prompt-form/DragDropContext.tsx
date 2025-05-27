
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DragDropContextType {
  draggedSectionId: string | null;
  handleDragStart: (sectionId: string) => void;
  handleDragEnd: () => void;
  handleDragOver: (e: React.DragEvent) => void;
}

const DragDropContext = createContext<DragDropContextType | null>(null);

export const useDragDrop = () => {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error('useDragDrop must be used within a DragDropProvider');
  }
  return context;
};

interface DragDropProviderProps {
  children: ReactNode;
}

export const DragDropProvider: React.FC<DragDropProviderProps> = ({ children }) => {
  const [draggedSectionId, setDraggedSectionId] = useState<string | null>(null);

  const handleDragStart = (sectionId: string) => {
    setDraggedSectionId(sectionId);
  };

  const handleDragEnd = () => {
    setDraggedSectionId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const value = {
    draggedSectionId,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
  };

  return (
    <DragDropContext.Provider value={value}>
      {children}
    </DragDropContext.Provider>
  );
};
