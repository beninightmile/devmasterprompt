
import React, { useState, useEffect } from 'react';
import { usePromptStore } from '@/store/promptStore';
import { generatePromptText } from '@/services/prompt-service';
import { autoSaveTemplate } from '@/services/template-service';
import { useToast } from '@/hooks/use-toast';
import PromptFormHeader from './PromptFormHeader';
import { DragDropProvider } from './DragDropProvider';
import SectionManager from './SectionManager';
import DialogManager from './DialogManager';
import AutoSaveHandler from './AutoSaveHandler';
import { usePromptFormHandlers } from '@/hooks/usePromptFormHandlers';

interface PromptFormProps {
  onPreviewToggle?: (value: boolean) => void;
}

const PromptForm: React.FC<PromptFormProps> = ({ onPreviewToggle }) => {
  const {
    sections,
    isPreviewMode,
    setPreviewMode,
    templateName,
    autoSaveEnabled,
    autoSaveInterval,
    lastSaveTime,
    setAutoSaveEnabled,
    setAutoSaveInterval,
    initializeDefaultAreas,
  } = usePromptStore();
  
  const [newSectionDialogOpen, setNewSectionDialogOpen] = useState(false);
  const [saveTemplateDialogOpen, setSaveTemplateDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [promptTemplateDialogOpen, setPromptTemplateDialogOpen] = useState(false);

  const { toast } = useToast();

  const {
    handleAddCustomSection,
    handleAddExistingSection,
    handleClearAll,
    handleImportSections,
    handleApplySoftwareTemplate,
  } = usePromptFormHandlers();

  // Generate the prompt text for token counting
  const promptText = generatePromptText(sections);

  // Initialize default areas if there are no sections
  useEffect(() => {
    if (sections.length === 0) {
      initializeDefaultAreas();
    }
  }, [initializeDefaultAreas, sections.length]);

  const handleAutoSave = () => {
    if (!templateName.trim()) {
      return; // Don't auto-save if no template name provided
    }
    
    const savedId = autoSaveTemplate();
    if (savedId) {
      toast({
        title: "Auto-saved",
        description: `"${templateName}" has been automatically saved.`,
        duration: 3000,
      });
    }
  };
  
  const handleTogglePreview = (value: boolean) => {
    if (onPreviewToggle) {
      onPreviewToggle(value);
    } else {
      setPreviewMode(value);
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Auto-save handler (no UI) */}
      <AutoSaveHandler onAutoSave={handleAutoSave} />
      
      {/* Header with template name, preview toggle, and action buttons */}
      <PromptFormHeader 
        isPreviewMode={isPreviewMode}
        onPreviewToggle={handleTogglePreview}
        promptText={promptText}
        onOpenSaveDialog={() => setSaveTemplateDialogOpen(true)}
        onOpenNewSectionDialog={() => setNewSectionDialogOpen(true)}
        onOpenUploadDialog={() => setUploadDialogOpen(true)}
        onOpenSoftwareTemplateDialog={() => setPromptTemplateDialogOpen(true)}
        onClearAll={handleClearAll}
        autoSaveEnabled={autoSaveEnabled}
        autoSaveInterval={autoSaveInterval}
        lastSaveTime={lastSaveTime}
        onAutoSaveToggle={setAutoSaveEnabled}
        onAutoSaveIntervalChange={setAutoSaveInterval}
        onAutoSave={handleAutoSave}
        templateName={templateName}
      />

      {/* Section list with drag and drop support */}
      <DragDropProvider>
        <SectionManager />
      </DragDropProvider>

      {/* Dialogs */}
      <DialogManager
        newSectionDialogOpen={newSectionDialogOpen}
        saveTemplateDialogOpen={saveTemplateDialogOpen}
        uploadDialogOpen={uploadDialogOpen}
        softwareTemplateDialogOpen={promptTemplateDialogOpen}
        sections={sections}
        templateName={templateName}
        onNewSectionDialogChange={setNewSectionDialogOpen}
        onSaveTemplateDialogChange={setSaveTemplateDialogOpen}
        onUploadDialogChange={setUploadDialogOpen}
        onSoftwareTemplateDialogChange={setPromptTemplateDialogOpen}
        onAddCustomSection={handleAddCustomSection}
        onAddExistingSection={handleAddExistingSection}
        onImportSections={handleImportSections}
        onApplySoftwareTemplate={handleApplySoftwareTemplate}
      />
    </div>
  );
};

export default PromptForm;
