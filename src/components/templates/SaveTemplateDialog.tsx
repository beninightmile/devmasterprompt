
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { usePromptStore } from '@/store/promptStore';

interface SaveTemplateDialogProps {
  onSave: (name: string, description: string, tags: string[]) => void;
}

const SaveTemplateDialog: React.FC<SaveTemplateDialogProps> = ({ onSave }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const { toast } = useToast();
  const promptStore = usePromptStore();

  // Get the current template name if available
  useEffect(() => {
    if (open) {
      // Find the template name from the template input field in PromptForm
      const templateInput = document.querySelector('input[placeholder="Template Name"]') as HTMLInputElement;
      if (templateInput && templateInput.value) {
        setName(templateInput.value);
      }
    }
  }, [open]);

  const handleSave = () => {
    if (!name.trim()) {
      toast({
        title: "Template name required",
        description: "Please give your template a name.",
        variant: "destructive",
      });
      return;
    }
    
    const tagsList = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');
    
    onSave(name, description, tagsList);
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setTags('');
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button>
          <Plus size={16} className="mr-2" />
          Save Current Prompt
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save as Template</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Template Name</Label>
            <Input
              id="name"
              placeholder="Enter a name for this template"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Enter a description for this template"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated, optional)</Label>
            <Input
              id="tags"
              placeholder="e.g. web, api, frontend, backend"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>Save Template</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveTemplateDialog;
