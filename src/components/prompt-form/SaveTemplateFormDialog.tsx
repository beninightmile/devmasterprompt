import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { usePromptStore } from '@/store/promptStore';
import { saveTemplate } from '@/services/template-service';
import { useToast } from '@/hooks/use-toast';

interface SaveTemplateFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SaveTemplateFormDialog: React.FC<SaveTemplateFormDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { sections, templateName, setTemplateName } = usePromptStore();
  const { toast } = useToast();
  
  const [name, setName] = useState(templateName);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const handleSave = () => {
    if (!name.trim()) {
      toast({
        title: "Template name required",
        description: "Please provide a name for your template.",
        variant: "destructive",
      });
      return;
    }

    try {
      saveTemplate(name.trim(), description.trim(), sections, tags);
      setTemplateName(name.trim());
      
      toast({
        title: "Template saved",
        description: `"${name}" has been saved successfully.`,
      });
      
      // Reset form
      setDescription('');
      setTags([]);
      setTagInput('');
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Failed to save template",
        description: "An error occurred while saving the template.",
        variant: "destructive",
      });
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Master Prompt as Template</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div>
            <Label>Tags</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Add a tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button type="button" size="sm" onClick={handleAddTag}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap mt-2">
              {tags.map((tag) => (
                <Badge key={tag} className="mr-2 mt-1 rounded-full px-3 py-1 text-sm flex items-center gap-x-2">
                  {tag}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-transparent p-0 h-4 w-4"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save template</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveTemplateFormDialog;
