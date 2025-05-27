
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getSoftwareTemplates } from '@/services/software-templates';
import { PromptSection } from '@/types/prompt';

interface SoftwareTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyTemplate: (sections: PromptSection[]) => void;
}

const SoftwareTemplateDialog: React.FC<SoftwareTemplateDialogProps> = ({
  open,
  onOpenChange,
  onApplyTemplate,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const templates = getSoftwareTemplates();

  const handleApplyTemplate = () => {
    if (selectedTemplate) {
      const template = templates.find(t => t.id === selectedTemplate);
      if (template) {
        onApplyTemplate(template.sections);
        onOpenChange(false);
        setSelectedTemplate(null);
      }
    }
  };

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Software Development Templates</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[600px]">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Available Templates</h3>
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-3">
                {templates.map(template => (
                  <Card 
                    key={template.id} 
                    className={`cursor-pointer transition-colors ${
                      selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1">
                        {template.tags?.map((tag: string) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {template.sections.length} sections
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Template Preview</h3>
            {selectedTemplateData ? (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedTemplateData.name}</CardTitle>
                    <CardDescription>{selectedTemplateData.description}</CardDescription>
                  </CardHeader>
                </Card>
                
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-3">
                    {selectedTemplateData.sections.map((s: PromptSection, index: number) => (
                      <Card key={index}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <span className="text-xs bg-muted px-2 py-1 rounded">
                              Level {s.level ?? 1}
                            </span>
                            {s.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xs text-muted-foreground line-clamp-3">
                            {s.content || 'No content preview available'}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
                
                <Button 
                  onClick={handleApplyTemplate} 
                  className="w-full"
                  disabled={!selectedTemplate}
                >
                  Apply Template ({selectedTemplateData.sections.length} sections)
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                Select a template to see preview
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SoftwareTemplateDialog;
