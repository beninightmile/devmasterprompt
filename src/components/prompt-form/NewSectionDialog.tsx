
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
import { defaultPromptSections } from '@/core/registry';
import { PromptSection } from '@/types/prompt';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface NewSectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCustomSection: (name: string, areaId?: string) => void;
  onAddExistingSection: (template: any) => void;
  existingSections: string[];
  areas: PromptSection[];
}

const NewSectionDialog: React.FC<NewSectionDialogProps> = ({
  open,
  onOpenChange,
  onAddCustomSection,
  onAddExistingSection,
  existingSections,
  areas,
}) => {
  const [newSectionName, setNewSectionName] = useState('');
  const [selectedAreaId, setSelectedAreaId] = useState<string | undefined>(
    areas.length > 0 ? areas[0].id : undefined
  );
  
  const handleAddSection = () => {
    if (newSectionName.trim()) {
      onAddCustomSection(newSectionName.trim(), selectedAreaId);
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
          <DialogTitle>Neue Sektion hinzufügen</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="area-select">Bereich auswählen</Label>
            <Select 
              value={selectedAreaId} 
              onValueChange={setSelectedAreaId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Wählen Sie einen Bereich" />
              </SelectTrigger>
              <SelectContent>
                {areas.map(area => (
                  <SelectItem key={area.id} value={area.id}>
                    {area.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="new-section-name">Name der neuen Sektion</Label>
            <Input 
              id="new-section-name" 
              placeholder="Geben Sie den Sektionsnamen ein" 
              value={newSectionName} 
              onChange={e => setNewSectionName(e.target.value)} 
            />
            <Button 
              onClick={handleAddSection} 
              disabled={!newSectionName.trim() || !selectedAreaId} 
              className="w-full mt-2"
            >
              Benutzerdefinierte Sektion erstellen
            </Button>
          </div>
          
          {unusedSections.length > 0 && (
            <div className="space-y-2 mt-4">
              <Label>Oder wählen Sie aus vordefinierten Sektionen</Label>
              <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                {unusedSections.map(template => (
                  <Button 
                    key={template.id} 
                    variant="outline" 
                    onClick={() => onAddExistingSection(template)} 
                    className="justify-start text-left h-auto py-2"
                  >
                    <div>
                      <div className="font-medium">{template.name}</div>
                      <div className="text-xs text-muted-foreground">{template.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewSectionDialog;
