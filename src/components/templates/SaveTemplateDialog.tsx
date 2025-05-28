
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Save } from 'lucide-react';

interface SaveTemplateDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave: (name: string, description: string, tags: string[]) => void;
}

const SaveTemplateDialog: React.FC<SaveTemplateDialogProps> = ({ 
  open, 
  onOpenChange, 
  onSave 
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = (newOpen: boolean) => {
    setIsOpen(newOpen);
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim(), description.trim(), tags);
      // Reset form
      setName('');
      setDescription('');
      setTags([]);
      setCurrentTag('');
      handleOpen(false);
    }
  };

  const dialogOpen = open !== undefined ? open : isOpen;

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpen}>
      {onOpenChange === undefined && (
        <DialogTrigger asChild>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Template
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save Prompt Template</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="template-name">Template Name</Label>
            <Input
              id="template-name"
              placeholder="Enter template name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="template-description">Description (Optional)</Label>
            <Textarea
              id="template-description"
              placeholder="Describe what this template is for..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="template-tags">Tags (Optional)</Label>
            <div className="flex flex-wrap gap-1 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                id="template-tags"
                placeholder="Add a tag..."
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button type="button" variant="outline" onClick={handleAddTag}>
                Add
              </Button>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => handleOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!name.trim()}>
              Save Template
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SaveTemplateDialog;
