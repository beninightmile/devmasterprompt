
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
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { saveCurrentPromptAsTemplate } from '@/services/template-service';
import { usePromptStore } from '@/store/promptStore';

interface SaveTemplateFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialName: string;
}

const SaveTemplateFormDialog: React.FC<SaveTemplateFormDialogProps> = ({ 
  open, 
  onOpenChange,
  initialName
}) => {
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templateTags, setTemplateTags] = useState('');
  const { toast } = useToast();
  const { currentTemplateId, updateLastSaveTime } = usePromptStore();

  // Initialize the template name when the dialog opens
  useEffect(() => {
    if (open && initialName) {
      setTemplateName(initialName);
    }
  }, [open, initialName]);

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      toast({
        title: "Template name required",
        description: "Please enter a name for your template.",
        variant: "destructive"
      });
      return;
    }

    try {
      const tags = templateTags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');
      
      const savedId = saveCurrentPromptAsTemplate(
        templateName.trim(),
        templateDescription.trim() || undefined,
        tags.length > 0 ? tags : undefined
      );
      
      updateLastSaveTime();
      
      toast({
        title: currentTemplateId ? "Template updated" : "Template saved",
        description: currentTemplateId 
          ? "Your template has been updated successfully."
          : "Your template has been saved successfully.",
      });
      
      // Reset form and close dialog
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Failed to save template",
        description: "An error occurred while saving your template.",
        variant: "destructive"
      });
    }
  };

  const handleClose = () => {
    setTemplateDescription('');
    setTemplateTags('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{currentTemplateId ? "Update Template" : "Save as Template"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="template-name">Template Name</Label>
            <Input
              id="template-name"
              placeholder="Enter a name for this template"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="template-description">Description (optional)</Label>
            <Textarea
              id="template-description"
              placeholder="Enter a description for this template"
              value={templateDescription}
              onChange={(e) => setTemplateDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="template-tags">Tags (comma separated, optional)</Label>
            <Input
              id="template-tags"
              placeholder="e.g. web, api, frontend, backend"
              value={templateTags}
              onChange={(e) => setTemplateTags(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSaveTemplate}>
            {currentTemplateId ? "Update Template" : "Save Template"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveTemplateFormDialog;
