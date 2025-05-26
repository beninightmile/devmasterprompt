
import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { PromptSection as PromptSectionType } from '@/types/prompt';
import PromptSection from '@/components/PromptSection';
import { usePromptStore } from '@/store/promptStore';

interface DragItem {
  id: string;
  type: 'section' | 'area';
  index: number;
  parentId?: string;
}

interface DraggableSectionProps {
  section: PromptSectionType;
  index: number;
  onMove: (dragIndex: number, hoverIndex: number, dragParentId?: string, hoverParentId?: string) => void;
  parentId?: string;
}

const DraggableSection: React.FC<DraggableSectionProps> = ({
  section,
  index,
  onMove,
  parentId
}) => {
  const { moveSectionToArea } = usePromptStore();
  
  const [{ isDragging }, drag] = useDrag({
    type: section.isArea ? 'area' : 'section',
    item: { 
      id: section.id, 
      type: section.isArea ? 'area' : 'section',
      index,
      parentId 
    } as DragItem,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ['section', 'area'],
    hover: (item: DragItem) => {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;
      const dragParentId = item.parentId;
      const hoverParentId = parentId;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex && dragParentId === hoverParentId) {
        return;
      }

      // Don't allow areas to be dropped into sections
      if (item.type === 'area' && section.level && section.level > 1) {
        return;
      }

      // Don't allow sections to be dropped into themselves
      if (item.id === section.id) {
        return;
      }

      onMove(dragIndex, hoverIndex, dragParentId, hoverParentId);
      
      // Update the item for continued monitoring
      item.index = hoverIndex;
      item.parentId = hoverParentId;
    },
    drop: (item: DragItem) => {
      // Handle final drop logic if needed
      if (item.parentId !== parentId) {
        moveSectionToArea(item.id, parentId);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const ref = React.useRef<HTMLDivElement>(null);
  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`transition-all duration-200 ${
        isDragging ? 'opacity-50 scale-95' : ''
      } ${
        isOver ? 'border-2 border-primary border-dashed' : ''
      }`}
    >
      <PromptSection
        id={section.id}
        name={section.name}
        content={section.content}
        isRequired={section.isRequired}
        level={section.level}
        isArea={section.isArea}
        isDragging={isDragging}
      />
    </div>
  );
};

export default DraggableSection;
