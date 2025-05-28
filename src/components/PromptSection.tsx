
import React, { useState } from 'react';
import { usePromptStore } from '@/store/promptStore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ChevronDown, ChevronRight, GripVertical, Trash2 } from 'lucide-react';
import TokenCounter from './TokenCounter';

interface PromptSectionProps {
  id: string;
  name: string;
  content: string;
  isRequired: boolean;
  isDragging?: boolean;
  level?: number;
  isArea?: boolean;
  isActive?: boolean;
  onClick?: () => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

const PromptSection: React.FC<PromptSectionProps> = ({
  id,
  name,
  content,
  isRequired,
  isDragging,
  level = 1,
  isArea = false,
  isActive = false,
  onClick,
  onDragStart,
  onDragEnd
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [sectionName, setSectionName] = useState(name);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { updateSection, removeSection } = usePromptStore();

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateSection(id, { content: e.target.value });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSectionName(e.target.value);
  };

  const handleNameBlur = () => {
    updateSection(id, { name: sectionName });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (!isRequired) {
      const confirmMessage = isArea 
        ? "Sind Sie sicher, dass Sie diesen Bereich und alle seine Sektionen löschen möchten?" 
        : "Sind Sie sicher, dass Sie diese Sektion löschen möchten?";
      
      if (window.confirm(confirmMessage)) {
        removeSection(id);
      }
    }
  };

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Create a class based on the level for styling
  const getLevelClass = () => {
    if (!level || level <= 1) return '';
    
    // Apply a different border/styling based on level
    const colors = [
      'border-l-4 border-primary',
      'border-l-4 border-secondary',
      'border-l-4 border-accent',
      'border-l-4 border-accent-pink',
      'border-l-4 border-muted-foreground'
    ];
    
    return colors[(level - 2) % colors.length];
  };

  // If this is an area, render it as a collapsible header
  if (isArea) {
    return null; // Areas are now handled by SectionList
  }

  return (
    <Card 
      className={`prompt-section ${isDragging ? 'opacity-50' : ''} ${getLevelClass()} ${isActive ? 'ring-2 ring-primary' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="prompt-section-header p-3">
        <div className="flex items-center space-x-2">
          {!isRequired && (
            <Button
              variant="ghost"
              size="icon"
              className="drag-handle"
              onMouseDown={onDragStart}
              onMouseUp={onDragEnd}
            >
              <GripVertical size={16} />
            </Button>
          )}
          
          {level > 1 && (
            <Button
              variant="ghost" 
              size="sm" 
              className="p-1" 
              onClick={toggleCollapsed}
            >
              {isCollapsed ? 
                <ChevronRight size={16} /> : 
                <ChevronDown size={16} />
              }
            </Button>
          )}
          
          {isEditing ? (
            <Input
              value={sectionName}
              onChange={handleNameChange}
              onBlur={handleNameBlur}
              onKeyDown={(e) => e.key === 'Enter' && handleNameBlur()}
              autoFocus
              className="font-medium"
            />
          ) : (
            <div className="flex items-center gap-2">
              <h3
                className={`font-medium cursor-pointer ${level > 1 ? 'text-sm' : ''}`}
                onClick={() => setIsEditing(true)}
              >
                {name}
              </h3>
              <TokenCounter text={content} />
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          {!isRequired && (
            <Button variant="ghost" size="icon" onClick={handleDelete} className="text-destructive">
              <Trash2 size={16} />
            </Button>
          )}
        </div>
      </CardHeader>
      
      {!isCollapsed && (
        <CardContent className="p-3 pt-0">
          <Textarea
            placeholder={`Add your ${name} content here...`}
            value={content}
            onChange={handleContentChange}
            className="section-content min-h-[120px]"
          />
        </CardContent>
      )}
    </Card>
  );
};

export default PromptSection;
