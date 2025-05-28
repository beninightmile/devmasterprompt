
import React from 'react';
import SectionList from './SectionList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { usePromptStore } from '@/store/promptStore';

const SectionManager: React.FC = () => {
  const { addArea, addSection } = usePromptStore();
  
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
  
  const handleAddIndependentSection = () => {
    const sectionName = prompt('Geben Sie einen Namen für die neue Sektion ein:');
    if (sectionName?.trim()) {
      addSection({
        id: crypto.randomUUID(),
        name: sectionName.trim(),
        content: '',
        isRequired: false,
        level: 1 // Independent section at top level
      });
    }
  };
  
  return (
    <div>
      <SectionList />
      
      <div className="flex gap-3 mt-6">
        <Button 
          variant="outline" 
          onClick={handleAddIndependentSection} 
        >
          <Plus className="h-4 w-4 mr-2" />
          Unabhängige Sektion hinzufügen
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleAddArea} 
        >
          <Plus className="h-4 w-4 mr-2" />
          Neuen Bereich hinzufügen
        </Button>
      </div>
    </div>
  );
};

export default SectionManager;
