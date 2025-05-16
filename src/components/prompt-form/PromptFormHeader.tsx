
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, Save, Eye } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import TokenCounter from '@/components/TokenCounter';

interface PromptFormHeaderProps {
  templateName: string;
  onTemplateNameChange: (name: string) => void;
  isPreviewMode: boolean;
  onPreviewToggle: (value: boolean) => void;
  promptText: string;
  onOpenSaveDialog: () => void;
  onOpenNewSectionDialog: () => void;
}

const PromptFormHeader: React.FC<PromptFormHeaderProps> = ({
  templateName,
  onTemplateNameChange,
  isPreviewMode,
  onPreviewToggle,
  promptText,
  onOpenSaveDialog,
  onOpenNewSectionDialog,
}) => {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex items-center">
        <Input
          placeholder="Template Name"
          value={templateName}
          onChange={(e) => onTemplateNameChange(e.target.value)}
          className="mr-2 max-w-md"
        />
        <div className="text-sm text-muted-foreground flex items-center ml-2">
          <span className="mr-2">Total:</span>
          <TokenCounter text={promptText} />
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">DevMasterPrompt</h1>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Label htmlFor="preview-mode" className="cursor-pointer">Preview</Label>
            <Switch id="preview-mode" checked={isPreviewMode} onCheckedChange={onPreviewToggle} />
          </div>
          
          <Button variant="outline" className="flex items-center space-x-2" onClick={onOpenSaveDialog}>
            <Save size={16} />
            <span>Save Template</span>
          </Button>
          
          <Button variant="outline" className="flex items-center space-x-2" onClick={onOpenNewSectionDialog}>
            <PlusCircle size={16} />
            <span>Add Section</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PromptFormHeader;
