
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Save, Eye, Plus, Upload, Template, Trash2, Clock } from 'lucide-react';
import { usePromptStore } from '@/store/promptStore';
import TokenCounter from '@/components/TokenCounter';
import AutoSaveSettings from './AutoSaveSettings';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';

interface PromptFormHeaderProps {
  isPreviewMode: boolean;
  onPreviewToggle: (value: boolean) => void;
  promptText: string;
  onOpenSaveDialog: () => void;
  onOpenNewSectionDialog: () => void;
  onOpenUploadDialog: () => void;
  onOpenSoftwareTemplateDialog: () => void;
  onClearAll: () => void;
  autoSaveEnabled: boolean;
  autoSaveInterval: number;
  lastSaveTime: Date | null;
  onAutoSaveToggle: (enabled: boolean) => void;
  onAutoSaveIntervalChange: (minutes: number) => void;
  onAutoSave: () => void;
  templateName: string;
}

const PromptFormHeader: React.FC<PromptFormHeaderProps> = ({
  isPreviewMode,
  onPreviewToggle,
  promptText,
  onOpenSaveDialog,
  onOpenNewSectionDialog,
  onOpenUploadDialog,
  onOpenSoftwareTemplateDialog,
  onClearAll,
  autoSaveEnabled,
  autoSaveInterval,
  lastSaveTime,
  onAutoSaveToggle,
  onAutoSaveIntervalChange,
  onAutoSave,
  templateName,
}) => {
  const { setTemplateName } = usePromptStore();

  return (
    <div className="space-y-4">
      {/* Template Name Input */}
      <div className="space-y-2">
        <Label htmlFor="template-name">Master Prompt Name</Label>
        <Input
          id="template-name"
          placeholder="Geben Sie einen Namen für Ihren Master Prompt ein..."
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          className="font-medium"
        />
      </div>

      {/* Controls Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            id="preview-mode"
            checked={isPreviewMode}
            onCheckedChange={onPreviewToggle}
          />
          <Label htmlFor="preview-mode" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Vorschaumodus
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <TokenCounter text={promptText} />
          {lastSaveTime && (
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              Gespeichert {formatDistanceToNow(lastSaveTime, { 
                addSuffix: true, 
                locale: de 
              })}
            </Badge>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={onOpenSaveDialog}>
          <Save className="h-4 w-4 mr-2" />
          Speichern
        </Button>
        <Button variant="outline" size="sm" onClick={onOpenNewSectionDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Sektion hinzufügen
        </Button>
        <Button variant="outline" size="sm" onClick={onOpenSoftwareTemplateDialog}>
          <Template className="h-4 w-4 mr-2" />
          Prompt Templates
        </Button>
        <Button variant="outline" size="sm" onClick={onOpenUploadDialog}>
          <Upload className="h-4 w-4 mr-2" />
          Inhalt importieren
        </Button>
        <Button variant="outline" size="sm" onClick={onClearAll}>
          <Trash2 className="h-4 w-4 mr-2" />
          Alles löschen
        </Button>
      </div>

      {/* Auto-save Settings */}
      <AutoSaveSettings
        autoSaveEnabled={autoSaveEnabled}
        autoSaveInterval={autoSaveInterval}
        onAutoSaveToggle={onAutoSaveToggle}
        onAutoSaveIntervalChange={onAutoSaveIntervalChange}
        onManualSave={onAutoSave}
        templateName={templateName}
      />
    </div>
  );
};

export default PromptFormHeader;
