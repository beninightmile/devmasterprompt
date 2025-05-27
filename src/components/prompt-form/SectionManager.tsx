
import React from 'react';
import { PromptSection as PromptSectionType } from '@/types/prompt';
import SectionList from './SectionList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { usePromptStore } from '@/store/promptStore';

interface SectionManagerProps {
  sections: PromptSectionType[];
}

const SectionManager: React.FC<SectionManagerProps> = ({ sections }) => {
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
      <SectionList sections={sections} />
      
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
