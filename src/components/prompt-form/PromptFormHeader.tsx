
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, Save, Eye, Trash2, Clock, Upload } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import TokenCounter from '@/components/TokenCounter';
import { usePromptStore } from '@/store/promptStore';
import AutoSaveSettings from './AutoSaveSettings';
import { format } from 'date-fns';

interface PromptFormHeaderProps {
  isPreviewMode: boolean;
  onPreviewToggle: (value: boolean) => void;
  promptText: string;
  onOpenSaveDialog: () => void;
  onOpenNewSectionDialog: () => void;
  onClearAll: () => void;
  onOpenUploadDialog: () => void;
  autoSaveEnabled: boolean;
  autoSaveInterval: number;
  lastSaveTime: Date | null;
  onAutoSaveToggle: (enabled: boolean) => void;
  onAutoSaveIntervalChange: (minutes: number) => void;
}

const PromptFormHeader: React.FC<PromptFormHeaderProps> = ({
  isPreviewMode,
  onPreviewToggle,
  promptText,
  onOpenSaveDialog,
  onOpenNewSectionDialog,
  onClearAll,
  onOpenUploadDialog,
  autoSaveEnabled,
  autoSaveInterval,
  lastSaveTime,
  onAutoSaveToggle,
  onAutoSaveIntervalChange
}) => {
  const {
    templateName,
    setTemplateName,
    currentTemplateId
  } = usePromptStore();

  return <div className="flex flex-col gap-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1">
          <Input placeholder="Template Name" value={templateName} onChange={e => setTemplateName(e.target.value)} className="mr-2 max-w-md" />
          <div className="text-sm text-muted-foreground flex items-center ml-2">
            <span className="mr-2">Total:</span>
            <TokenCounter text={promptText} />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="flex items-center gap-2" 
            onClick={onOpenUploadDialog}
          >
            <Upload size={16} />
            <span>Upload Prompt</span>
          </Button>
          
          <AutoSaveSettings enabled={autoSaveEnabled} interval={autoSaveInterval} onEnabledChange={onAutoSaveToggle} onIntervalChange={onAutoSaveIntervalChange} />
          {lastSaveTime && <span className="text-xs text-muted-foreground ml-2">
              Last saved: {format(lastSaveTime, 'HH:mm:ss')}
            </span>}
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
            <span>{currentTemplateId ? 'Update Template' : 'Save Template'}</span>
          </Button>
          
          <Button variant="outline" className="flex items-center space-x-2" onClick={onOpenNewSectionDialog}>
            <PlusCircle size={16} />
            <span>Add Section</span>
          </Button>
          
          <Button variant="destructive" className="flex items-center space-x-2" onClick={onClearAll}>
            <Trash2 size={16} />
            <span></span>
          </Button>
        </div>
      </div>
    </div>;
};

export default PromptFormHeader;
