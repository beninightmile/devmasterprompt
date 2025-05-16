
import React, { useState } from 'react';
import { usePromptStore } from '@/store/promptStore';
import { generatePromptText } from '@/services/prompt-service';
import PromptFormHeader from './prompt-form/PromptFormHeader';
import NewSectionDialog from './prompt-form/NewSectionDialog';
import SaveTemplateFormDialog from './prompt-form/SaveTemplateFormDialog';
import SectionList from './prompt-form/SectionList';

interface PromptFormProps {
  onPreviewToggle?: (value: boolean) => void;
}

const PromptForm: React.FC<PromptFormProps> = ({ onPreviewToggle }) => {
  const {
    sections,
    isPreviewMode,
    setPreviewMode,
    addSection,
    reorderSections
  } = usePromptStore();
  
  const [draggedSectionId, setDraggedSectionId] = useState<string | null>(null);
  const [newSectionDialogOpen, setNewSectionDialogOpen] = useState(false);
  const [saveTemplateDialogOpen, setSaveTemplateDialogOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');

  // Generate the prompt text for token counting
  const promptText = generatePromptText(sections);
  
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
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header with template name, preview toggle, and action buttons */}
      <PromptFormHeader 
        templateName={templateName}
        onTemplateNameChange={setTemplateName}
        isPreviewMode={isPreviewMode}
        onPreviewToggle={handleTogglePreview}
        promptText={promptText}
        onOpenSaveDialog={handleOpenSaveDialog}
        onOpenNewSectionDialog={() => setNewSectionDialogOpen(true)}
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
    </div>
  );
};

export default PromptForm;
