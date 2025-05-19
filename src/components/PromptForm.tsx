
import React, { useState, useEffect, useRef } from 'react';
import { usePromptStore } from '@/store/promptStore';
import { generatePromptText, cleanupSectionName, mergeSections } from '@/services/prompt-service';
import { autoSaveTemplate } from '@/services/template-service';
import { useToast } from '@/hooks/use-toast';
import PromptFormHeader from './prompt-form/PromptFormHeader';
import NewSectionDialog from './prompt-form/NewSectionDialog';
import SaveTemplateFormDialog from './prompt-form/SaveTemplateFormDialog';
import UploadPromptDialog from './prompt-form/UploadPromptDialog';
import SectionList from './prompt-form/SectionList';
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
    reorderSections,
    clearAll,
    templateName,
    currentTemplateId,
    autoSaveEnabled,
    autoSaveInterval,
    lastSaveTime,
    setAutoSaveEnabled,
    setAutoSaveInterval,
  } = usePromptStore();
  
  const [draggedSectionId, setDraggedSectionId] = useState<string | null>(null);
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
  
  const handleDragStart = (id: string) => {
    setDraggedSectionId(id);
  };
  
  const handleDragEnd = () => {
    setDraggedSectionId(null);
  };
  
  const handleDragOver = (id: string) => {
    if (draggedSectionId && draggedSectionId !== id) {
      const currentIds = sections.sort((a, b) => a.order - b.order).map(section => section.id);
      const fromIndex = currentIds.indexOf(draggedSectionId);
      const toIndex = currentIds.indexOf(id);
      if (fromIndex !== -1 && toIndex !== -1) {
        const newOrder = [...currentIds];
        newOrder.splice(fromIndex, 1);
        newOrder.splice(toIndex, 0, draggedSectionId);
        reorderSections(newOrder);
      }
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
    // Clean up section names to be more readable
    const cleanedSections = uploadedSections.map(section => ({
      ...section,
      name: cleanupSectionName(section.name)
    }));
    
    // Ask if user wants to merge with existing content or replace it
    if (sections.filter(s => s.content.trim() !== '').length > 0 && cleanedSections.length > 0) {
      // There's existing content, so confirm before replacing
      const shouldMerge = window.confirm(
        "Do you want to merge the uploaded content with your existing sections? " +
        "Click OK to merge or Cancel to replace all existing content."
      );
      
      if (shouldMerge) {
        // Merge with existing content
        const mergedSections = mergeSections(sections, cleanedSections);
        
        // Reset sections and add all merged ones
        clearAll();
        mergedSections.forEach(section => {
          addSection(section);
        });
        
        toast({
          title: "Content merged",
          description: `${cleanedSections.length} sections were successfully merged with existing content.`,
        });
      } else {
        // Replace existing content
        clearAll();
        cleanedSections.forEach(section => {
          addSection(section);
        });
        
        toast({
          title: "Content replaced",
          description: `${cleanedSections.length} sections were imported, replacing previous content.`,
        });
      }
    } else {
      // No existing content or no uploaded content, just add the sections
      cleanedSections.forEach(section => {
        addSection(section);
      });
      
      toast({
        title: "Content imported",
        description: `${cleanedSections.length} sections were successfully imported.`,
      });
    }
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
      />

      {/* Section list */}
      <SectionList 
        sections={sections}
        onDragOver={handleDragOver}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      />

      {/* New section dialog */}
      <NewSectionDialog 
        open={newSectionDialogOpen}
        onOpenChange={setNewSectionDialogOpen}
        onAddCustomSection={handleAddCustomSection}
        onAddExistingSection={handleAddExistingSection}
        existingSections={sections.map(section => section.id)}
      />

      {/* Save template dialog */}
      <SaveTemplateFormDialog 
        open={saveTemplateDialogOpen}
        onOpenChange={setSaveTemplateDialogOpen}
        initialName={templateName}
      />
      
      {/* Upload prompt dialog */}
      <UploadPromptDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onImportSections={handleImportSections}
      />
    </div>
  );
};

export default PromptForm;
