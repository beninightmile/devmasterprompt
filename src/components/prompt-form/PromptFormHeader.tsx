
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import AutoSaveSettings from './AutoSaveSettings';
import TokenCounter from '../TokenCounter';
import { usePromptStore } from '@/store/promptStore';
import PromptFormActions from './PromptFormActions';

interface PromptFormHeaderProps {
  isPreviewMode: boolean;
  promptText: string;
  templateName: string;
  autoSaveEnabled: boolean;
  autoSaveInterval: number;
  lastSaveTime: Date | null;
  onPreviewToggle: (value: boolean) => void;
  onOpenSaveDialog: () => void;
  onOpenNewSectionDialog: () => void;
  onOpenUploadDialog: () => void;
  onOpenSoftwareTemplateDialog: () => void;
  onClearAll: () => void;
  onAutoSaveToggle: (enabled: boolean) => void;
  onAutoSaveIntervalChange: (minutes: number) => void;
  onAutoSave: () => void;
}

const PromptFormHeader: React.FC<PromptFormHeaderProps> = ({
  isPreviewMode,
  promptText,
  templateName,
  autoSaveEnabled,
  autoSaveInterval,
  lastSaveTime,
  onPreviewToggle,
  onOpenSaveDialog,
  onOpenNewSectionDialog,
  onOpenUploadDialog,
  onOpenSoftwareTemplateDialog,
  onClearAll,
  onAutoSaveToggle,
  onAutoSaveIntervalChange,
  onAutoSave,
}) => {
  const { setTemplateName } = usePromptStore();

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
        <div className="flex-1 min-w-0">
          <Input
            placeholder="Master Prompt Name"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="text-lg font-semibold"
          />
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <Label htmlFor="preview-mode">Preview Mode</Label>
          <Switch
            id="preview-mode"
            checked={isPreviewMode}
            onCheckedChange={onPreviewToggle}
          />
        </div>
      </div>

      <div className="flex flex-wrap justify-between gap-2">
        <div>
          <TokenCounter text={promptText} />
        </div>
        
        <AutoSaveSettings 
          enabled={autoSaveEnabled}
          interval={autoSaveInterval} 
          lastSaveTime={lastSaveTime}
          onToggle={onAutoSaveToggle}
          onIntervalChange={onAutoSaveIntervalChange}
        />
      </div>

      <PromptFormActions
        templateName={templateName}
        autoSaveEnabled={autoSaveEnabled}
        lastSaveTime={lastSaveTime}
        onTogglePreview={onPreviewToggle}
        onOpenSaveDialog={onOpenSaveDialog}
        onOpenNewSectionDialog={onOpenNewSectionDialog}
        onOpenUploadDialog={onOpenUploadDialog}
        onOpenSoftwareTemplateDialog={onOpenSoftwareTemplateDialog}
        onClearAll={onClearAll}
      />
    </div>
  );
};

export default PromptFormHeader;
