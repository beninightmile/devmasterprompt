
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { defaultPromptSections } from '@/core/registry';

interface NewSectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCustomSection: (name: string) => void;
  onAddExistingSection: (template: any) => void;
  existingSections: string[];
}

const NewSectionDialog: React.FC<NewSectionDialogProps> = ({
  open,
  onOpenChange,
  onAddCustomSection,
  onAddExistingSection,
  existingSections,
}) => {
  const [newSectionName, setNewSectionName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  
  const handleAddSection = () => {
    if (newSectionName.trim()) {
      onAddCustomSection(newSectionName.trim());
      setNewSectionName('');
    }
  };
  
  // Filter out sections that already exist in the prompt
  const unusedSections = defaultPromptSections.filter(
    template => !existingSections.includes(template.id)
  );
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a New Section</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="new-section-name">Custom Section Name</Label>
            <Input 
              id="new-section-name" 
              placeholder="Enter section name" 
              value={newSectionName} 
              onChange={e => setNewSectionName(e.target.value)} 
            />
            <Button 
              onClick={handleAddSection} 
              disabled={!newSectionName.trim()} 
              className="w-full mt-2"
            >
              Create Custom Section
            </Button>
          </div>
          
          {unusedSections.length > 0 && (
            <div className="space-y-2 mt-4">
              <Label>Or choose from template sections</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a template section" />
                </SelectTrigger>
                <SelectContent>
                  {unusedSections.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedTemplate && (
                <Button 
                  onClick={() => {
                    const template = unusedSections.find(t => t.id === selectedTemplate);
                    if (template) {
                      onAddExistingSection(template);
                      setSelectedTemplate('');
                    }
                  }}
                  className="w-full"
                >
                  Add Selected Section
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewSectionDialog;
