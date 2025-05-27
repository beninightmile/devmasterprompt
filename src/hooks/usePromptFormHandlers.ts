
import { usePromptStore } from '@/store/promptStore';
import { useToast } from '@/hooks/use-toast';
import { PromptSection } from '@/types/prompt';

export const usePromptFormHandlers = () => {
  const { addSection, clearAll } = usePromptStore();
  const { toast } = useToast();

  const handleAddCustomSection = (sectionName: string) => {
    if (sectionName.trim()) {
      addSection({
        id: crypto.randomUUID(),
        name: sectionName.trim(),
        content: '',
        isRequired: false
      });
    }
  };

  const handleAddExistingSection = (template: any) => {
    addSection({
      id: template.id,
      name: template.name,
      content: template.defaultContent,
      isRequired: template.required
    });
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
    if (!uploadedSections || uploadedSections.length === 0) {
      toast({
        title: "No sections to import",
        description: "No valid sections were found in the uploaded content.",
        variant: "destructive",
      });
      return;
    }

    let importCount = 0;
    uploadedSections.forEach(section => {
      if (section.name && section.name.trim()) {
        addSection({
          id: crypto.randomUUID(),
          name: section.name.trim(),
          content: section.content || '',
          isRequired: section.isRequired || false,
          isArea: section.isArea ?? false,
          level: section.level ?? 1,
          parentId: section.parentId ?? undefined,
        });
        importCount++;
      }
    });
    
    toast({
      title: `${importCount} sections imported`,
      description: `Successfully added ${importCount} sections to your master prompt.`,
      duration: 5000,
    });
  };

  const handleApplySoftwareTemplate = (templateSections: PromptSection[]) => {
    clearAll();
    
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

  return {
    handleAddCustomSection,
    handleAddExistingSection,
    handleClearAll,
    handleImportSections,
    handleApplySoftwareTemplate,
  };
};
