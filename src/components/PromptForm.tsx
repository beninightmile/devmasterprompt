
import React, { useState } from 'react';
import { usePromptStore } from '@/store/promptStore';
import { generatePromptText } from '@/services/prompt-service';
import { autoSaveTemplate } from '@/services/template-service';
import { useToast } from '@/hooks/use-toast';
import PromptFormHeader from './prompt-form/PromptFormHeader';
import { PromptSection } from '@/types/prompt';
import AutoSaveHandler from './prompt-form/AutoSaveHandler';
import SectionManager from './prompt-form/SectionManager';
import DialogManager from './prompt-form/DialogManager';
import { DragDropProvider } from './prompt-form/DragDropContext';

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
    autoSaveEnabled,
    autoSaveInterval,
    lastSaveTime,
    setAutoSaveEnabled,
    setAutoSaveInterval,
  } = usePromptStore();
  
  const [newSectionDialogOpen, setNewSectionDialogOpen] = useState(false);
  const [saveTemplateDialogOpen, setSaveTemplateDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [softwareTemplateDialogOpen, setSoftwareTemplateDialogOpen] = useState(false);
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
        // We always add a section with a new UUID to avoid collisions
        addSection({
          id: crypto.randomUUID(), // Generate a new ID for each section
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
      description: `Successfully added ${importCount} sections to your master prompt.`,
      duration: 5000,
    });
  };

  const handleApplySoftwareTemplate = (templateSections: PromptSection[]) => {
    if (sections.length > 0) {
      const confirmApply = window.confirm(
        "Applying a software template will replace your current sections. Do you want to continue?"
      );
      
      if (!confirmApply) {
        return;
      }
      
      clearAll();
    }
    
    // Add each section from the template
    templateSections.forEach(section => {
      addSection({
        id: crypto.randomUUID(),
        name: section.name,
        content: section.content,
        isRequired: section.isRequired
      });
    });
    
    toast({
      title: "Template applied",
      description: `Successfully applied the software template with ${templateSections.length} sections.`,
      duration: 5000,
    });
  };

  const handleOpenSoftwareTemplateDialog = () => {
    setSoftwareTemplateDialogOpen(true);
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
        onOpenSaveDialog={() => setSaveTemplateDialogOpen(true)}
        onOpenNewSectionDialog={() => setNewSectionDialogOpen(true)}
        onOpenUploadDialog={() => setUploadDialogOpen(true)}
        onClearAll={handleClearAll}
        autoSaveEnabled={autoSaveEnabled}
        autoSaveInterval={autoSaveInterval}
        lastSaveTime={lastSaveTime}
        onAutoSaveToggle={setAutoSaveEnabled}
        onAutoSaveIntervalChange={setAutoSaveInterval}
        onAutoSave={handleAutoSave}
        templateName={templateName}
        onOpenSoftwareTemplateDialog={handleOpenSoftwareTemplateDialog}
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
        softwareTemplateDialogOpen={softwareTemplateDialogOpen}
        sections={sections}
        templateName={templateName}
        onNewSectionDialogChange={setNewSectionDialogOpen}
        onSaveTemplateDialogChange={setSaveTemplateDialogOpen}
        onUploadDialogChange={setUploadDialogOpen}
        onSoftwareTemplateDialogChange={setSoftwareTemplateDialogOpen}
        onAddCustomSection={handleAddCustomSection}
        onAddExistingSection={handleAddExistingSection}
        onImportSections={handleImportSections}
        onApplySoftwareTemplate={handleApplySoftwareTemplate}
      />
    </div>
  );
};

export default PromptForm;
