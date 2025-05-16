import React, { useState } from 'react';
import { useTemplateStore } from '@/store/templateStore';
import { usePromptStore } from '@/store/promptStore';
import { loadTemplateIntoPrompt, saveCurrentPromptAsTemplate, getPopularTags } from '@/services/template-service';
import { getNonEmptySectionsCount } from '@/services/prompt-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Search, 
  Clock, 
  Calendar, 
  Tag, 
  Filter, 
  Trash2,
  Edit 
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import ModelCompatibility from '@/components/ModelCompatibility';

const TemplatesPage: React.FC = () => {
  const { templates, deleteTemplate } = useTemplateStore();
  const { sections } = usePromptStore();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateDesc, setNewTemplateDesc] = useState('');
  const [newTemplateTags, setNewTemplateTags] = useState('');
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
  
  const handleSaveTemplate = () => {
    if (!newTemplateName.trim()) {
      toast({
        title: "Template name required",
        description: "Please give your template a name.",
        variant: "destructive",
      });
      return;
    }
    
    const tags = newTemplateTags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');
    
    try {
      saveCurrentPromptAsTemplate(
        newTemplateName,
        newTemplateDesc,
        tags
      );
      
      toast({
        title: "Template saved",
        description: "Your prompt template has been saved successfully.",
      });
      
      // Reset the form
      setNewTemplateName('');
      setNewTemplateDesc('');
      setNewTemplateTags('');
      setSaveDialogOpen(false);
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
      loadTemplateIntoPrompt(templateId);
      toast({
        title: "Template loaded",
        description: "The template has been loaded into the prompt builder.",
      });
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
  
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Template Library</h1>
        
        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-2" />
              Save Current Prompt
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save as Template</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  placeholder="Enter a name for this template"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Enter a description for this template"
                  value={newTemplateDesc}
                  onChange={(e) => setNewTemplateDesc(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated, optional)</Label>
                <Input
                  id="tags"
                  placeholder="e.g. web, api, frontend, backend"
                  value={newTemplateTags}
                  onChange={(e) => setNewTemplateTags(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSaveTemplate}>Save Template</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search templates"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {selectedTag && (
            <Badge variant="secondary" className="flex items-center gap-2">
              <Tag size={12} />
              {selectedTag}
              <button 
                onClick={() => setSelectedTag(null)}
                className="ml-1 text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      </div>
      
      {popularTags.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center mb-2 text-sm text-muted-foreground">
            <Tag size={14} className="mr-2" />
            <span>Popular Tags:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularTags.map(tag => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No templates found</p>
          <Button variant="outline" onClick={() => { setSearchTerm(''); setSelectedTag(null); }}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <Card key={template.id}>
              <CardHeader>
                <CardTitle>{template.name}</CardTitle>
                {template.description && (
                  <CardDescription>{template.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-4">
                  <div className="flex items-center mb-1">
                    <Calendar size={14} className="mr-2" />
                    Created: {format(new Date(template.createdAt), 'PP')}
                  </div>
                  <div className="flex items-center">
                    <Clock size={14} className="mr-2" />
                    Updated: {format(new Date(template.updatedAt), 'PP')}
                  </div>
                </div>
                <div className="text-sm space-y-1">
                  <p>
                    {template.sections.length} sections
                    {' ('}
                    {getNonEmptySectionsCount(template.sections)} with content{')'}
                  </p>
                  {template.totalTokens && (
                    <p className="font-medium">
                      {template.totalTokens} tokens
                    </p>
                  )}
                </div>
                {template.tags && template.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {template.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                {template.totalTokens && template.totalTokens > 0 && (
                  <div className="mt-4">
                    <ModelCompatibility tokenCount={template.totalTokens} />
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" onClick={() => confirmDeleteTemplate(template.id)}>
                  <Trash2 size={14} className="mr-2" />
                  Delete
                </Button>
                <Button size="sm" onClick={() => handleLoadTemplate(template.id)}>
                  Use Template
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the template.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTemplate}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TemplatesPage;
