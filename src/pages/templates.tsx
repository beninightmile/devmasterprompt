
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTemplateStore } from '@/store/templateStore';
import { usePromptStore } from '@/store/promptStore';
import { loadTemplateIntoPrompt, saveCurrentPromptAsTemplate, getPopularTags } from '@/services/template-service';
import { useToast } from '@/components/ui/use-toast';
import TemplateCard from '@/components/templates/TemplateCard';
import SaveTemplateDialog from '@/components/templates/SaveTemplateDialog';
import TemplateFilters from '@/components/templates/TemplateFilters';
import DeleteTemplateDialog from '@/components/templates/DeleteTemplateDialog';
import NoTemplatesFound from '@/components/templates/NoTemplatesFound';

const TemplatesPage: React.FC = () => {
  const { templates, deleteTemplate } = useTemplateStore();
  const { setPreviewMode } = usePromptStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  
  const popularTags = getPopularTags(templates);
  
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = searchTerm === '' || 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesTag = selectedTag === null || 
      template.tags?.includes(selectedTag);
      
    return matchesSearch && matchesTag;
  });
  
  const handleSaveTemplate = (name: string, description: string, tags: string[]) => {
    try {
      saveCurrentPromptAsTemplate(name, description, tags);
      
      toast({
        title: "Template saved",
        description: "Your prompt template has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed to save template",
        description: "An error occurred while saving your template.",
        variant: "destructive",
      });
    }
  };
  
  const handleLoadTemplate = (templateId: string) => {
    try {
      const success = loadTemplateIntoPrompt(templateId);
      if (success) {
        // Set preview mode to false to ensure user sees the editor
        setPreviewMode(false);
        
        // Navigate back to the builder page
        navigate('/');
        
        toast({
          title: "Template loaded",
          description: "The template has been loaded into the prompt builder.",
        });
      } else {
        toast({
          title: "Failed to load template",
          description: "Template not found.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to load template",
        description: "An error occurred while loading the template.",
        variant: "destructive",
      });
    }
  };
  
  const confirmDeleteTemplate = (id: string) => {
    setTemplateToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteTemplate = () => {
    if (templateToDelete) {
      deleteTemplate(templateToDelete);
      setDeleteDialogOpen(false);
      setTemplateToDelete(null);
      toast({
        title: "Template deleted",
        description: "The template has been deleted.",
      });
    }
  };
  
  const clearFilters = () => { 
    setSearchTerm(''); 
    setSelectedTag(null); 
  };
  
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Template Library</h1>
        <SaveTemplateDialog onSave={handleSaveTemplate} />
      </div>

      <TemplateFilters 
        searchTerm={searchTerm}
        selectedTag={selectedTag}
        popularTags={popularTags}
        onSearchChange={setSearchTerm}
        onTagSelect={setSelectedTag}
      />

      {filteredTemplates.length === 0 ? (
        <NoTemplatesFound onClearFilters={clearFilters} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <TemplateCard 
              key={template.id}
              template={template}
              onDelete={confirmDeleteTemplate}
              onLoad={handleLoadTemplate}
            />
          ))}
        </div>
      )}
      
      <DeleteTemplateDialog 
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteTemplate}
      />
    </div>
  );
};

export default TemplatesPage;
