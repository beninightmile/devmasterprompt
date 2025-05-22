
import React from 'react';
import { PromptSection as PromptSectionType } from '@/types/prompt';
import SectionList from './SectionList';
import { useDragDrop } from './DragDropContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { usePromptStore } from '@/store/promptStore';

interface SectionManagerProps {
  sections: PromptSectionType[];
}

const SectionManager: React.FC<SectionManagerProps> = ({ sections }) => {
  const { draggedSectionId, handleDragStart, handleDragEnd, handleDragOver } = useDragDrop();
  const { addArea } = usePromptStore();
  
  const handleAddArea = () => {
    const areaName = prompt('Geben Sie einen Namen für den neuen Bereich ein:');
    if (areaName?.trim()) {
      addArea({
        id: crypto.randomUUID(),
        name: areaName.trim(),
        content: '',
        isRequired: false
      });
    }
  };
  
  return (
    <div>
      <SectionList 
        sections={sections}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        draggedSectionId={draggedSectionId}
      />
      
      <Button 
        variant="outline" 
        onClick={handleAddArea} 
        className="mt-6"
      >
        <Plus className="h-4 w-4 mr-2" />
        Neuen Bereich hinzufügen
      </Button>
    </div>
  );
};

export default SectionManager;
