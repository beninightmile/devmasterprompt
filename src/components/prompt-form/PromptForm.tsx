
import React, { useState, useEffect, useRef } from 'react';
import { usePromptStore } from '@/store/promptStore';
import { generatePromptText } from '@/services/prompt-service';
import { autoSaveTemplate } from '@/services/template-service';
import { useToast } from '@/hooks/use-toast';
import PromptFormHeader from './PromptFormHeader';
import NewSectionDialog from './NewSectionDialog';
import SaveTemplateFormDialog from './SaveTemplateFormDialog';
import UploadPromptDialog from './upload-dialog/UploadPromptDialog';
import SectionList from './SectionList';
import DragAndDropManager from './DragAndDropManager';
import { PromptSection } from '@/types/prompt';

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
  const autoSaveTimerRef = useRef<number | null>(null);

  // Generate the prompt text for token counting
  const promptText = generatePromptText(sections);
  
  // Setup auto-save
  useEffect(() => {
    // Clear existing timer
    if (autoSaveTimerRef.current) {
      window.clearInterval(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }
    
    // Set up new timer if auto-save is enabled
    if (autoSaveEnabled && templateName.trim()) {
      const intervalMs = autoSaveInterval * 60 * 1000; // Convert minutes to milliseconds
      autoSaveTimerRef.current = window.setInterval(() => {
        handleAutoSave();
      }, intervalMs);
    }
    
    // Clean up on unmount
    return () => {
      if (autoSaveTimerRef.current) {
        window.clearInterval(autoSaveTimerRef.current);
      }
    };
  }, [autoSaveEnabled, autoSaveInterval, templateName]);
  
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
    // Logic for importing sections moved to the parent component
    // Section management is handled directly by SectionList and the store
    setUploadDialogOpen(false);
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
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
      <DragAndDropManager>
        {({ onDragStart, onDragOver, onDragEnd, draggedSectionId }) => (
          <SectionList 
            sections={sections}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
            draggedSectionId={draggedSectionId}
          />
        )}
      </DragAndDropManager>

      {/* Dialogs */}
      <NewSectionDialog 
        open={newSectionDialogOpen}
        onOpenChange={setNewSectionDialogOpen}
        onAddCustomSection={handleAddCustomSection}
        onAddExistingSection={handleAddExistingSection}
        existingSections={sections.map(section => section.id)}
      />

      <SaveTemplateFormDialog 
        open={saveTemplateDialogOpen}
        onOpenChange={setSaveTemplateDialogOpen}
        initialName={templateName}
      />
      
      <UploadPromptDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onImportSections={handleImportSections}
      />
    </div>
  );
};

export default PromptForm;
