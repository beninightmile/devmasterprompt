
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSavedPromptStore } from '@/store/savedPromptStore';
import { usePromptStore } from '@/store/promptStore';
import { loadSavedPrompt } from '@/services/saved-prompt-service';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit3, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';

const SavedPromptsPage: React.FC = () => {
  const { savedPrompts, deletePrompt } = useSavedPromptStore();
  const { setPreviewMode } = usePromptStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  const filteredPrompts = savedPrompts.filter(prompt => {
    const matchesSearch = searchTerm === '' || 
      prompt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesTag = selectedTag === null || 
      prompt.tags?.includes(selectedTag);
      
    return matchesSearch && matchesTag;
  });
  
  // Get all unique tags
  const allTags = Array.from(
    new Set(savedPrompts.flatMap(prompt => prompt.tags || []))
  ).slice(0, 10);
  
  const handleLoadPrompt = (promptId: string) => {
    try {
      const success = loadSavedPrompt(promptId);
      if (success) {
        setPreviewMode(false);
        navigate('/');
        
        toast({
          title: "Prompt geladen",
          description: "Der gespeicherte Prompt wurde in den Editor geladen.",
        });
      } else {
        toast({
          title: "Fehler beim Laden",
          description: "Prompt wurde nicht gefunden.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Fehler beim Laden",
        description: "Es ist ein Fehler beim Laden des Prompts aufgetreten.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeletePrompt = (id: string, name: string) => {
    if (window.confirm(`Möchten Sie "${name}" wirklich löschen?`)) {
      deletePrompt(id);
      toast({
        title: "Prompt gelöscht",
        description: "Der gespeicherte Prompt wurde gelöscht.",
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
        <h1 className="text-2xl font-bold">Gespeicherte Prompts</h1>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4 items-center">
          <Input
            placeholder="Prompts durchsuchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          {(searchTerm || selectedTag) && (
            <Button variant="outline" onClick={clearFilters}>
              Filter zurücksetzen
            </Button>
          )}
        </div>
        
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Tags:</span>
            {allTags.map(tag => (
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
        )}
      </div>

      {filteredPrompts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {savedPrompts.length === 0 
              ? "Noch keine Prompts gespeichert." 
              : "Keine Prompts gefunden."}
          </p>
          {savedPrompts.length === 0 ? (
            <Button onClick={() => navigate('/')}>
              Ersten Prompt erstellen
            </Button>
          ) : (
            <Button variant="outline" onClick={clearFilters}>
              Filter zurücksetzen
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map(prompt => (
            <Card key={prompt.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="line-clamp-2">{prompt.name}</CardTitle>
                {prompt.description && (
                  <CardDescription className="line-clamp-3">
                    {prompt.description}
                  </CardDescription>
                )}
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {formatDistanceToNow(new Date(prompt.updatedAt), {
                        addSuffix: true,
                        locale: de
                      })}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="secondary">
                      {prompt.sections.length} Sektionen
                    </Badge>
                    {prompt.totalTokens && (
                      <Badge variant="outline">
                        {prompt.totalTokens.toLocaleString()} Tokens
                      </Badge>
                    )}
                  </div>
                  
                  {prompt.tags && prompt.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {prompt.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {prompt.tags.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{prompt.tags.length - 3} mehr
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="gap-2">
                <Button 
                  variant="default" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleLoadPrompt(prompt.id)}
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Laden
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDeletePrompt(prompt.id, prompt.name)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPromptsPage;
