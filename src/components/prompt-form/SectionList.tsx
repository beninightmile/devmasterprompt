
import React, { useCallback } from 'react';
import { PromptSection as PromptSectionType } from '@/types/prompt';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { usePromptStore } from '@/store/promptStore';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import DraggableSection from './DraggableSection';

interface SectionListProps {
  sections: PromptSectionType[];
}

const SectionList: React.FC<SectionListProps> = ({ sections }) => {
  const { addSection, reorderSections } = usePromptStore();
  
  // Sort sections by order
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);
  
  // Get standard sections (level 1, not areas, no parentId)
  const standardSections = sortedSections.filter(
    section => !section.isArea && section.level === 1 && !section.parentId
  );
  
  // Group sections by their parentId (if any)
  const areas = sortedSections.filter(section => section.isArea);
  
  // Track open state for each area
  const [openAreas, setOpenAreas] = React.useState<{ [key: string]: boolean }>(
    areas.reduce((acc, area) => ({ ...acc, [area.id]: true }), {})
  );
  
  // Toggle area collapsed state
  const toggleArea = (areaId: string) => {
    setOpenAreas(prev => ({ ...prev, [areaId]: !prev[areaId] }));
  };
  
  // Add a new section to an area
  const handleAddSection = (areaId: string) => {
    addSection({
      id: crypto.randomUUID(),
      name: 'Neue Sektion',
      content: '',
      isRequired: false,
      level: 2
    }, areaId);
  };

  const moveSection = useCallback((
    dragIndex: number, 
    hoverIndex: number
  ) => {
    if (dragIndex < 0 || hoverIndex < 0 || 
        dragIndex >= sortedSections.length || 
        hoverIndex >= sortedSections.length) {
      return;
    }

    const newSections = [...sortedSections];
    const draggedSection = newSections[dragIndex];
    
    // Remove dragged section and insert at new position
    newSections.splice(dragIndex, 1);
    newSections.splice(hoverIndex, 0, draggedSection);
    
    // Update orders and reorder
    const updatedIds = newSections.map(s => s.id);
    reorderSections(updatedIds);
  }, [sortedSections, reorderSections]);

  // Render standard sections first
  const renderStandardSections = () => {
    if (standardSections.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Standardbereiche</h3>
        <div className="space-y-3">
          {standardSections.map((section, index) => (
            <DraggableSection
              key={section.id}
              section={section}
              index={index}
            >
              <div className="border rounded-lg p-4">
                <h4 className="font-medium">{section.name}</h4>
                {section.content && (
                  <p className="text-sm text-muted-foreground mt-2">{section.content}</p>
                )}
              </div>
            </DraggableSection>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {renderStandardSections()}
      
      {/* Render areas with their child sections */}
      {areas.map((area, areaIndex) => {
        // Get child sections for this area
        const childSections = sortedSections.filter(
          section => section.parentId === area.id
        ).sort((a, b) => a.order - b.order);
        
        return (
          <Collapsible
            key={area.id}
            open={openAreas[area.id]}
            onOpenChange={() => toggleArea(area.id)}
            className="border rounded-lg overflow-hidden"
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left bg-muted hover:bg-muted/80">
              <DraggableSection
                section={area}
                index={areaIndex}
              >
                <div className="flex-1">
                  <h4 className="font-medium">{area.name}</h4>
                </div>
              </DraggableSection>
              <span className="text-sm text-muted-foreground ml-4">
                ({childSections.length} {childSections.length === 1 ? 'Sektion' : 'Sektionen'})
              </span>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              {/* Area content */}
              {area.content && (
                <div className="px-4 pt-2 pb-0">
                  <div className="text-sm text-muted-foreground border-b pb-2 mb-2">
                    {area.content}
                  </div>
                </div>
              )}
              <div className="p-4 space-y-4">
                {childSections.map((section, index) => (
                  <div key={section.id} className="ml-4">
                    <DraggableSection
                      section={section}
                      index={index}
                      parentId={area.id}
                    >
                      <div className="border rounded-lg p-4">
                        <h5 className="font-medium">{section.name}</h5>
                        {section.content && (
                          <p className="text-sm text-muted-foreground mt-2">{section.content}</p>
                        )}
                      </div>
                    </DraggableSection>
                  </div>
                ))}
                
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-4 mt-2"
                  onClick={() => handleAddSection(area.id)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Sektion hinzufügen
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
};

export default SectionList;
