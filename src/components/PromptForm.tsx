import React, { useState } from 'react';
import { usePromptStore } from '@/store/promptStore';
import PromptSection from './PromptSection';
import { Button } from '@/components/ui/button';
import { PlusCircle, Eye, EyeOff } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { defaultPromptSections } from '@/core/registry';
const PromptForm: React.FC = () => {
  const {
    sections,
    isPreviewMode,
    setPreviewMode,
    addSection,
    reorderSections
  } = usePromptStore();
  const [draggedSectionId, setDraggedSectionId] = useState<string | null>(null);
  const [newSectionDialogOpen, setNewSectionDialogOpen] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');

  // Sort sections by order
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);
  const handleDragStart = (id: string) => {
    setDraggedSectionId(id);
  };
  const handleDragEnd = () => {
    setDraggedSectionId(null);
  };
  const handleDragOver = (id: string) => {
    if (draggedSectionId && draggedSectionId !== id) {
      const currentIds = sortedSections.map(section => section.id);
      const fromIndex = currentIds.indexOf(draggedSectionId);
      const toIndex = currentIds.indexOf(id);
      if (fromIndex !== -1 && toIndex !== -1) {
        const newOrder = [...currentIds];
        newOrder.splice(fromIndex, 1);
        newOrder.splice(toIndex, 0, draggedSectionId);
        reorderSections(newOrder);
      }
    }
  };
  const handleAddSection = () => {
    if (newSectionName.trim()) {
      addSection({
        id: crypto.randomUUID(),
        name: newSectionName.trim(),
        content: '',
        isRequired: false
      });
      setNewSectionName('');
      setNewSectionDialogOpen(false);
    }
  };
  const unusedSections = defaultPromptSections.filter(template => !sections.some(section => section.id === template.id));
  const handleAddExistingSection = (template: typeof defaultPromptSections[0]) => {
    addSection({
      id: template.id,
      name: template.name,
      content: template.defaultContent,
      isRequired: template.required
    });
    setNewSectionDialogOpen(false);
  };
  return <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">DevMasterPrompt</h1>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Label htmlFor="preview-mode" className="cursor-pointer">Preview</Label>
            <Switch id="preview-mode" checked={isPreviewMode} onCheckedChange={setPreviewMode} />
          </div>
          
          <Dialog open={newSectionDialogOpen} onOpenChange={setNewSectionDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-2">
                <PlusCircle size={16} />
                <span>Add Section</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a New Section</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="new-section-name">Custom Section Name</Label>
                  <Input id="new-section-name" placeholder="Enter section name" value={newSectionName} onChange={e => setNewSectionName(e.target.value)} />
                  <Button onClick={handleAddSection} disabled={!newSectionName.trim()} className="w-full mt-2">
                    Create Custom Section
                  </Button>
                </div>
                
                {unusedSections.length > 0 && <div className="space-y-2 mt-4">
                    <Label>Or choose from template sections</Label>
                    <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                      {unusedSections.map(template => <Button key={template.id} variant="outline" onClick={() => handleAddExistingSection(template)} className="justify-start text-left h-auto py-2">
                          <div>
                            <div className="font-medium">{template.name}</div>
                            <div className="text-xs text-muted-foreground">{template.description}</div>
                          </div>
                        </Button>)}
                    </div>
                  </div>}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-4">
        {sortedSections.map(section => <div key={section.id} onDragOver={() => handleDragOver(section.id)}>
            <PromptSection id={section.id} name={section.name} content={section.content} isRequired={section.isRequired} isDragging={section.id === draggedSectionId} onDragStart={() => handleDragStart(section.id)} onDragEnd={handleDragEnd} />
          </div>)}
      </div>
    </div>;
};
export default PromptForm;