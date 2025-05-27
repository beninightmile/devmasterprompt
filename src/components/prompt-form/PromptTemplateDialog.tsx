import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { usePromptStore } from '@/store/promptStore';
import { generatePromptText } from '@/services/prompt-service';
import CopyButton from '../CopyButton';

interface PromptTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sections: any[];
  templateName: string;
}

const PromptTemplateDialog: React.FC<PromptTemplateDialogProps> = ({
  open,
  onOpenChange,
  sections,
  templateName,
}) => {
  const { isPreviewMode } = usePromptStore();
  const [customName, setCustomName] = useState(templateName);

  const promptText = generatePromptText(sections);
  
  // Calculate estimated tokens (rough estimation: 1 token ≈ 4 characters)
  const estimatedTokens = Math.ceil(promptText.length / 4);
  
  // Group sections by level for hierarchical display
  const groupedSections = sections.reduce((acc, section) => {
    const level = section.level ?? 1;
    if (!acc[level]) {
      acc[level] = [];
    }
    acc[level].push(section);
    return acc;
  }, {} as Record<number, any[]>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Master Prompt Template</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value={customName} className="col-span-3" onChange={(e) => setCustomName(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="prompt-text" className="text-right">
              Master Prompt
            </Label>
            <Textarea id="prompt-text" value={promptText} className="col-span-3 font-mono text-sm" readOnly />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tokens" className="text-right">
              Estimated Tokens
            </Label>
            <Input id="tokens" value={estimatedTokens.toString()} className="col-span-3" readOnly />
          </div>
          
          <div className="space-y-2">
            <Label>Sections Preview</Label>
            <div className="max-h-48 overflow-y-auto">
              {Object.entries(groupedSections).sort((a, b) => Number(a[0]) - Number(b[0])).map(([level, sections]) => (
                <div key={level} className="space-y-1">
                  <p className="text-sm font-medium">Level {level}</p>
                  <div className="pl-2">
                    {sections.map(section => (
                      <div key={section.id} className="text-xs text-muted-foreground">
                        {section.name}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between">
          <CopyButton text={promptText} />
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PromptTemplateDialog;
