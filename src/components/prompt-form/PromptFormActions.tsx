
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { autoSaveTemplate } from '@/services/template-service';

interface PromptFormActionsProps {
  templateName: string;
  autoSaveEnabled: boolean;
  lastSaveTime: Date | null;
  onTogglePreview: (value: boolean) => void;
  onOpenSaveDialog: () => void;
  onOpenNewSectionDialog: () => void;
  onOpenUploadDialog: () => void;
  onClearAll: () => void;
}

const PromptFormActions: React.FC<PromptFormActionsProps> = ({
  templateName,
  autoSaveEnabled,
  lastSaveTime,
  onTogglePreview,
  onOpenSaveDialog,
  onOpenNewSectionDialog,
  onOpenUploadDialog,
  onClearAll,
}) => {
  const { toast } = useToast();

  const handleAutoSave = () => {
    if (!templateName.trim()) {
      toast({
        title: "Cannot save",
        description: "Please provide a template name first.",
        variant: "destructive"
      });
      return;
    }
    
    const savedId = autoSaveTemplate();
    if (savedId) {
      toast({
        title: "Saved",
        description: `"${templateName}" has been saved.`,
        duration: 3000,
      });
    }
  };

  return (
    <div className="flex flex-wrap gap-2 justify-end mb-4">
      <Button variant="outline" size="sm" onClick={() => onTogglePreview(true)}>
        Preview
      </Button>
      <Button variant="outline" size="sm" onClick={onOpenSaveDialog}>
        Save Template
      </Button>
      <Button variant="outline" size="sm" onClick={onOpenNewSectionDialog}>
        Add Section
      </Button>
      <Button variant="outline" size="sm" onClick={onOpenUploadDialog}>
        Import Text
      </Button>
      <Button variant="outline" size="sm" onClick={handleAutoSave}
        disabled={!autoSaveEnabled || !templateName}>
        Save Now
      </Button>
      <Button variant="outline" size="sm" onClick={onClearAll}>
        Clear All
      </Button>
    </div>
  );
};

export default PromptFormActions;
