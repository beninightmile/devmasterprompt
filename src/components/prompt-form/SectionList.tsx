
import React from 'react';
import PromptSection from '@/components/PromptSection';
import { PromptSection as PromptSectionType } from '@/types/prompt';
import { Button } from '@/components/ui/button';
import { Plus, ArrowUp, ArrowDown } from 'lucide-react';
import { usePromptStore } from '@/store/promptStore';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SectionListProps {
  sections: PromptSectionType[];
  onDragOver: (id: string) => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  draggedSectionId?: string | null;
}

const SectionList: React.FC<SectionListProps> = ({
  sections,
  onDragOver,
  onDragStart,
  onDragEnd,
  draggedSectionId,
}) => {
  const { addSection, updateSection, removeSection, moveSectionToArea, reorderSections } = usePromptStore();
  
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

  // Move section up/down within same context
  const moveSectionUp = (section: PromptSectionType) => {
    const contextSections = section.parentId 
      ? sortedSections.filter(s => s.parentId === section.parentId).sort((a, b) => a.order - b.order)
      : standardSections;
    
    const currentIndex = contextSections.findIndex(s => s.id === section.id);
    if (currentIndex > 0) {
      const newOrder = [...contextSections];
      [newOrder[currentIndex], newOrder[currentIndex - 1]] = [newOrder[currentIndex - 1], newOrder[currentIndex]];
      
      // Update orders
      const updatedSections = sections.map(s => {
        const newIndex = newOrder.findIndex(ns => ns.id === s.id);
        if (newIndex !== -1) {
          return { ...s, order: newIndex + 1 };
        }
        return s;
      });
      
      reorderSections(updatedSections.map(s => s.id));
    }
  };

  const moveSectionDown = (section: PromptSectionType) => {
    const contextSections = section.parentId 
      ? sortedSections.filter(s => s.parentId === section.parentId).sort((a, b) => a.order - b.order)
      : standardSections;
    
    const currentIndex = contextSections.findIndex(s => s.id === section.id);
    if (currentIndex < contextSections.length - 1) {
      const newOrder = [...contextSections];
      [newOrder[currentIndex], newOrder[currentIndex + 1]] = [newOrder[currentIndex + 1], newOrder[currentIndex]];
      
      // Update orders
      const updatedSections = sections.map(s => {
        const newIndex = newOrder.findIndex(ns => ns.id === s.id);
        if (newIndex !== -1) {
          return { ...s, order: newIndex + 1 };
        }
        return s;
      });
      
      reorderSections(updatedSections.map(s => s.id));
    }
  };

  // Move section to different area or make independent
  const handleMoveSection = (sectionId: string, targetAreaId?: string) => {
    moveSectionToArea(sectionId, targetAreaId);
  };

  // Render standard sections first
  const renderStandardSections = () => {
    if (standardSections.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Standardbereiche</h3>
        <div className="space-y-3">
          {standardSections.map((section, index) => (
            <div key={section.id} className="relative group">
              <div className="flex items-start gap-2">
                <div className="flex flex-col gap-1 mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveSectionUp(section)}
                    disabled={index === 0}
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveSectionDown(section)}
                    disabled={index === standardSections.length - 1}
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex-1" onDragOver={() => onDragOver(section.id)}>
                  <PromptSection
                    id={section.id}
                    name={section.name}
                    content={section.content}
                    isRequired={section.isRequired}
                    level={section.level}
                    isDragging={section.id === draggedSectionId}
                    onDragStart={() => onDragStart(section.id)}
                    onDragEnd={onDragEnd}
                  />
                </div>
              </div>
              
              {/* Move to area options */}
              <div className="ml-16 mt-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-muted-foreground">Verschieben nach:</span>
                {areas.map(area => (
                  <Button
                    key={area.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleMoveSection(section.id, area.id)}
                    className="h-6 px-2 text-xs"
                  >
                    {area.name}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {renderStandardSections()}
      
      {/* Render areas with their child sections */}
      {areas.map(area => {
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
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-medium">{area.name}</h3>
                <span className="text-sm text-muted-foreground">
                  ({childSections.length} {childSections.length === 1 ? 'Sektion' : 'Sektionen'})
                </span>
              </div>
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
                  <div key={section.id} className="relative group">
                    <div className="flex items-start gap-2">
                      <div className="flex flex-col gap-1 mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveSectionUp(section)}
                          disabled={index === 0}
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveSectionDown(section)}
                          disabled={index === childSections.length - 1}
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>
                      <div
                        className="flex-1 ml-4"
                        onDragOver={() => onDragOver(section.id)}
                      >
                        <PromptSection
                          id={section.id}
                          name={section.name}
                          content={section.content}
                          isRequired={section.isRequired}
                          level={section.level}
                          isDragging={section.id === draggedSectionId}
                          onDragStart={() => onDragStart(section.id)}
                          onDragEnd={onDragEnd}
                        />
                      </div>
                    </div>
                    
                    {/* Move to other areas or make independent */}
                    <div className="ml-20 mt-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs text-muted-foreground">Verschieben:</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMoveSection(section.id)}
                        className="h-6 px-2 text-xs"
                      >
                        Unabhängig machen
                      </Button>
                      {areas.filter(a => a.id !== area.id).map(otherArea => (
                        <Button
                          key={otherArea.id}
                          variant="outline"
                          size="sm"
                          onClick={() => handleMoveSection(section.id, otherArea.id)}
                          className="h-6 px-2 text-xs"
                        >
                          → {otherArea.name}
                        </Button>
                      ))}
                    </div>
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
