
import { useState } from 'react';
import { usePromptStore } from '@/store/promptStore';
import { useToast } from '@/hooks/use-toast';
import { autoSaveTemplate } from '@/services/template-service';
import { PromptSection } from '@/types/prompt';

export const usePromptFormHandlers = () => {
  const {
    sections,
    addSection,
    clearAll,
    templateName,
  } = usePromptStore();
  
  const { toast } = useToast();
  
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

  return {
    handleAutoSave,
    handleAddCustomSection,
    handleAddExistingSection,
    handleClearAll,
    handleImportSections,
    handleApplySoftwareTemplate,
  };
};
