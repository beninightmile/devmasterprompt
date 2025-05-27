
import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { PromptSection } from '@/types/prompt';
import { usePromptStore } from '@/store/promptStore';

interface DraggableSectionProps {
  section: PromptSection;
  index: number;
  children: React.ReactNode;
  parentId?: string;
}

const DraggableSection: React.FC<DraggableSectionProps> = ({
  section,
  index,
  children,
  parentId,
}) => {
  const { reorderSections } = usePromptStore();

  const [{ isDragging }, drag] = useDrag({
    type: 'SECTION',
    item: { id: section.id, index, parentId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'SECTION',
    hover: (draggedItem: { id: string; index: number; parentId?: string }) => {
      if (draggedItem.index !== index || draggedItem.parentId !== parentId) {
        const sectionIds = usePromptStore.getState().sections.map(s => s.id);
        reorderSections(sectionIds);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className={`${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
    >
      {React.cloneElement(children as React.ReactElement, {
        id: section.id,
        name: section.name,
        content: section.content,
        isRequired: section.isRequired,
        level: section.level ?? 1,
        isArea: section.isArea ?? false,
      })}
    </div>
  );
};

export default DraggableSection;
