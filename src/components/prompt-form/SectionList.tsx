
import React from 'react';
import PromptSection from '@/components/PromptSection';
import { PromptSection as PromptSectionType } from '@/types/prompt';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
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
  const { addSection, updateSection, removeSection } = usePromptStore();
  
  // Sort sections by order
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);
  
  // Get standard sections (level 1, not areas)
  const standardSections = sortedSections.filter(
    section => !section.isArea && section.level === 1
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
      level: 2,
      parentId: areaId
    }, areaId);
  };

  // Edit area name
  const handleEditAreaName = (area: PromptSectionType, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent collapsible from toggling
    const newName = prompt("Bereichsname bearbeiten:", area.name);
    if (newName && newName.trim()) {
      updateSection(area.id, { name: newName.trim() });
    }
  };

  // Edit area content
  const handleEditAreaContent = (area: PromptSectionType, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent collapsible from toggling
    const newContent = prompt("Bereichsbeschreibung bearbeiten:", area.content);
    if (newContent !== null) {
      updateSection(area.id, { content: newContent });
    }
  };

  // Delete area (and its children)
  const handleDeleteArea = (areaId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent collapsible from toggling
    const confirm = window.confirm("Sind Sie sicher, dass Sie diesen Bereich und alle seine Sektionen löschen möchten?");
    if (confirm) {
      removeSection(areaId);
    }
  };

  // Render standard sections first
  const renderStandardSections = () => {
    if (standardSections.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Standardbereiche</h3>
        <div className="space-y-3">
          {standardSections.map(section => (
            <div key={section.id} onDragOver={() => onDragOver(section.id)}>
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
          ))}
        </div>
      </div>
    );
  };

  // Render sections that don't belong to any area (orphaned sections)
  const renderOrphanedSections = () => {
    const orphanedSections = sortedSections.filter(
      section => !section.isArea && !section.parentId && section.level > 1
    );
    
    if (orphanedSections.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Unsortierte Sektionen</h3>
        <div className="space-y-3">
          {orphanedSections.map(section => (
            <div key={section.id} onDragOver={() => onDragOver(section.id)}>
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
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {renderStandardSections()}
      {renderOrphanedSections()}
      
      {/* Render areas with their child sections */}
      {areas.map(area => {
        // Get child sections for this area
        const childSections = sortedSections.filter(
          section => section.parentId === area.id
        );
        
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
              <div className="flex items-center space-x-2" onClick={e => e.stopPropagation()}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={(e) => handleEditAreaName(area, e)}
                  className="h-8 w-8 p-0"
                >
                  <span className="sr-only">Bereich umbenennen</span>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={(e) => handleDeleteArea(area.id, e)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <span className="sr-only">Bereich löschen</span>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              {/* Area content */}
              {area.content && (
                <div className="px-4 pt-2 pb-0">
                  <div className="text-sm text-muted-foreground border-b pb-2 mb-2 flex justify-between">
                    <div>{area.content}</div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => handleEditAreaContent(area, e)}
                      className="ml-2 h-6 w-6 p-0"
                    >
                      <Edit className="h-3 w-3" />
                      <span className="sr-only">Bereichsbeschreibung bearbeiten</span>
                    </Button>
                  </div>
                </div>
              )}
              <div className="p-4 space-y-4">
                {childSections.map(section => (
                  <div
                    key={section.id}
                    onDragOver={() => onDragOver(section.id)}
                    className="ml-4"
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
