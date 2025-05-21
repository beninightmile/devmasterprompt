
import React, { useState } from 'react';
import { usePromptStore } from '@/store/promptStore';
import { generatePromptText } from '@/services/prompt-service';
import { autoSaveTemplate } from '@/services/template-service';
import { useToast } from '@/hooks/use-toast';
import PromptFormHeader from './PromptFormHeader';
import NewSectionDialog from './NewSectionDialog';
import SaveTemplateFormDialog from './SaveTemplateFormDialog';
import UploadPromptDialog from './upload-dialog/UploadPromptDialog';
import SectionList from './SectionList';
import { DragDropProvider } from './DragDropContext';
import SectionManager from './SectionManager';
import { PromptSection } from '@/types/prompt';
import DialogManager from './DialogManager';
import AutoSaveHandler from './AutoSaveHandler';

interface PromptFormProps {
  onPreviewToggle?: (value: boolean) => void;
}

const PromptForm: React.FC<PromptFormProps> = ({ onPreviewToggle }) => {
  const {
    sections,
    isPreviewMode,
    setPreviewMode,
    addSection,
    clearAll,
    templateName,
    currentTemplateId,
    autoSaveEnabled,
    autoSaveInterval,
    lastSaveTime,
    setAutoSaveEnabled,
    setAutoSaveInterval,
  } = usePromptStore();
  
  const [newSectionDialogOpen, setNewSectionDialogOpen] = useState(false);
  const [saveTemplateDialogOpen, setSaveTemplateDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const { toast } = useToast();

  // Generate the prompt text for token counting
  const promptText = generatePromptText(sections);
  
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
  
  const handleAddCustomSection = (sectionName: string) => {
    if (sectionName.trim()) {
      addSection({
        id: crypto.randomUUID(),
        name: sectionName.trim(),
        content: '',
        isRequired: false
      });
      setNewSectionDialogOpen(false);
    }
  };
  
  const handleAddExistingSection = (template: any) => {
    addSection({
      id: template.id,
      name: template.name,
      content: template.defaultContent,
      isRequired: template.required
    });
    setNewSectionDialogOpen(false);
  };
  
  const handleTogglePreview = (value: boolean) => {
    if (onPreviewToggle) {
      onPreviewToggle(value);
    } else {
      setPreviewMode(value);
    }
  };
  
  const handleOpenSaveDialog = () => {
    setSaveTemplateDialogOpen(true);
  };
  
  const handleClearAll = () => {
    const confirmClear = window.confirm("Are you sure you want to clear all content? This action cannot be undone.");
    if (confirmClear) {
      clearAll();
      toast({
        title: "Content cleared",
        description: "All sections have been reset to their default state.",
      });
    }
  };
  
  const handleOpenUploadDialog = () => {
    setUploadDialogOpen(true);
  };
  
  const handleImportSections = (uploadedSections: PromptSection[]) => {
    // Check if we have sections to import
    if (!uploadedSections || uploadedSections.length === 0) {
      toast({
        title: "No sections to import",
        description: "No valid sections were found in the uploaded content.",
        variant: "destructive",
      });
      return;
    }

    // Add each uploaded section to the store
    let importCount = 0;
    uploadedSections.forEach(section => {
      if (section.name && section.name.trim()) {
        addSection({
          id: section.id || crypto.randomUUID(),
          name: section.name.trim(),
          content: section.content || '',
          isRequired: section.isRequired || false
        });
        importCount++;
      }
    });
    
    // Close the dialog and show success message
    setUploadDialogOpen(false);
    
    toast({
      title: `${importCount} sections imported`,
      description: `Successfully added ${importCount} sections to your prompt.`,
      duration: 5000,
    });
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Auto-save handler (no UI) */}
      <AutoSaveHandler onAutoSave={handleAutoSave} />
      
      {/* Header with template name, preview toggle, and action buttons */}
      <PromptFormHeader 
        isPreviewMode={isPreviewMode}
        onPreviewToggle={handleTogglePreview}
        promptText={promptText}
        onOpenSaveDialog={handleOpenSaveDialog}
        onOpenNewSectionDialog={() => setNewSectionDialogOpen(true)}
        onOpenUploadDialog={handleOpenUploadDialog}
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
        <SectionManager sections={sections} />
      </DragDropProvider>

      {/* Dialogs */}
      <DialogManager
        newSectionDialogOpen={newSectionDialogOpen}
        saveTemplateDialogOpen={saveTemplateDialogOpen}
        uploadDialogOpen={uploadDialogOpen}
        sections={sections}
        templateName={templateName}
        onNewSectionDialogChange={setNewSectionDialogOpen}
        onSaveTemplateDialogChange={setSaveTemplateDialogOpen}
        onUploadDialogChange={setUploadDialogOpen}
        onAddCustomSection={handleAddCustomSection}
        onAddExistingSection={handleAddExistingSection}
        onImportSections={handleImportSections}
      />
    </div>
  );
};

export default PromptForm;
