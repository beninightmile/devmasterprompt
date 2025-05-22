
import React, { useState, useEffect } from 'react';
import { usePromptStore } from '@/store/promptStore';
import { generatePromptText } from '@/services/prompt-service';
import { autoSaveTemplate } from '@/services/template-service';
import { useToast } from '@/hooks/use-toast';
import PromptFormHeader from './PromptFormHeader';
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
    initializeDefaultAreas,
  } = usePromptStore();
  
  const [newSectionDialogOpen, setNewSectionDialogOpen] = useState(false);
  const [saveTemplateDialogOpen, setSaveTemplateDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [softwareTemplateDialogOpen, setSoftwareTemplateDialogOpen] = useState(false);
  const { toast } = useToast();

  // Generate the prompt text for token counting
  const promptText = generatePromptText(sections);

  // Initialize default areas if there are no sections
  useEffect(() => {
    if (sections.length === 0) {
      initializeDefaultAreas();
    }
  }, [initializeDefaultAreas, sections.length]);
  
  // Get all areas
  const areas = sections.filter(section => section.isArea);
  
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
  
  const handleAddCustomSection = (sectionName: string, areaId?: string) => {
    if (sectionName.trim()) {
      addSection({
        id: crypto.randomUUID(),
        name: sectionName.trim(),
        content: '',
        isRequired: false
      }, areaId);
      setNewSectionDialogOpen(false);
    }
  };
  
  const handleAddExistingSection = (template: any) => {
    // Get the first area if available
    const firstArea = areas.length > 0 ? areas[0].id : undefined;
    
    addSection({
      id: template.id,
      name: template.name,
      content: template.defaultContent,
      isRequired: template.required
    }, firstArea);
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
    const confirmClear = window.confirm("Sind Sie sicher, dass Sie alle Inhalte löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.");
    if (confirmClear) {
      clearAll();
      toast({
        title: "Inhalte gelöscht",
        description: "Alle Sektionen wurden auf ihren Standardzustand zurückgesetzt.",
      });
    }
  };
  
  const handleOpenUploadDialog = () => {
    setUploadDialogOpen(true);
  };
  
  const handleOpenSoftwareTemplateDialog = () => {
    setSoftwareTemplateDialogOpen(true);
  };
  
  const handleImportSections = (uploadedSections: PromptSection[]) => {
    // Check if we have sections to import
    if (!uploadedSections || uploadedSections.length === 0) {
      toast({
        title: "Keine Sektionen zum Importieren",
        description: "Es wurden keine gültigen Sektionen im hochgeladenen Inhalt gefunden.",
        variant: "destructive",
      });
      return;
    }

    // Add each uploaded section to the store
    let importCount = 0;
    uploadedSections.forEach(section => {
      if (section.name && section.name.trim()) {
        // Find parent area if this is a child section
        let parentId = section.parentId;
        
        // If this is not an area and has no parent, assign to first area
        if (!section.isArea && !parentId && areas.length > 0) {
          parentId = areas[0].id;
        }
        
        addSection({
          id: section.id || crypto.randomUUID(),
          name: section.name.trim(),
          content: section.content || '',
          isRequired: section.isRequired || false,
          isArea: section.isArea,
          level: section.level,
          parentId
        }, parentId);
        importCount++;
      }
    });
    
    // Close the dialog and show success message
    setUploadDialogOpen(false);
    
    toast({
      title: `${importCount} Sektionen importiert`,
      description: `${importCount} Sektionen wurden erfolgreich zu Ihrem Master Prompt hinzugefügt.`,
      duration: 5000,
    });
  };

  const handleApplySoftwareTemplate = (templateSections: PromptSection[]) => {
    if (sections.length > 0) {
      const confirmApply = window.confirm(
        "Wenn Sie eine Software-Vorlage anwenden, werden Ihre aktuellen Sektionen ersetzt. Möchten Sie fortfahren?"
      );
      
      if (!confirmApply) {
        return;
      }
      
      clearAll();
    }
    
    // Add each section from the template
    templateSections.forEach(section => {
      if (section.isArea) {
        // Add the area first
        const areaId = crypto.randomUUID();
        addSection({
          id: areaId,
          name: section.name,
          content: section.content,
          isRequired: section.isRequired,
          isArea: true
        });
        
        // Then find and add its child sections
        const childSections = templateSections.filter(s => s.parentId === section.id);
        childSections.forEach(child => {
          addSection({
            id: crypto.randomUUID(),
            name: child.name,
            content: child.content,
            isRequired: child.isRequired,
            level: 2,
            parentId: areaId
          }, areaId);
        });
      }
    });
    
    toast({
      title: "Vorlage angewendet",
      description: `Die Software-Vorlage wurde erfolgreich mit ${templateSections.filter(s => !s.parentId).length} Bereichen angewendet.`,
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
        onOpenSoftwareTemplateDialog={handleOpenSoftwareTemplateDialog}
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
