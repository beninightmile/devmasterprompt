
import React, { useState } from 'react';
import { usePromptStore } from '@/store/promptStore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { GripVertical, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

interface PromptSectionProps {
  id: string;
  name: string;
  content: string;
  isRequired: boolean;
  isDragging?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

const PromptSection: React.FC<PromptSectionProps> = ({
  id,
  name,
  content,
  isRequired,
  isDragging,
  onDragStart,
  onDragEnd
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [sectionName, setSectionName] = useState(name);
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
      removeSection(id);
    }
  };

  return (
    <Card className={`prompt-section ${isDragging ? 'opacity-50' : ''}`}>
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
            <h3
              className="font-medium cursor-pointer"
              onClick={() => setIsEditing(true)}
            >
              {name}
            </h3>
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
      
      <CardContent className="p-3 pt-0">
        <Textarea
          placeholder={`Add your ${name} content here...`}
          value={content}
          onChange={handleContentChange}
          className="section-content min-h-[120px]"
        />
      </CardContent>
    </Card>
  );
};

export default PromptSection;
