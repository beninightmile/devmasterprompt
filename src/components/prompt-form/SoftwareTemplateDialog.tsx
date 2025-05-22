
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { SoftwareTemplate, getAllSoftwareTemplates, convertTemplateToSections } from '@/services/software-templates';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PromptSection } from '@/types/prompt';

interface SoftwareTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (sections: PromptSection[]) => void;
}

const ComplexityBadge = ({ complexity }: { complexity: SoftwareTemplate['complexity'] }) => {
  const colors = {
    low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    enterprise: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[complexity]}`}>
      {complexity.charAt(0).toUpperCase() + complexity.slice(1)}
    </span>
  );
};

const SoftwareTemplateDialog: React.FC<SoftwareTemplateDialogProps> = ({
  open,
  onOpenChange,
  onSelectTemplate,
}) => {
  const templates = getAllSoftwareTemplates();

  const handleSelectTemplate = (template: SoftwareTemplate) => {
    const sections = convertTemplateToSections(template);
    onSelectTemplate(sections);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Choose Software Template</DialogTitle>
          <DialogDescription>
            Select a template based on your project type and complexity to get started with appropriate sections.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-4 p-1">
            {templates.map((template) => (
              <div 
                key={template.id}
                className="border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer"
                onClick={() => handleSelectTemplate(template)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{template.name}</h3>
                    <p className="text-muted-foreground text-sm mt-1">{template.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <ComplexityBadge complexity={template.complexity} />
                      <Badge variant="outline">Est. {template.estimatedTime}</Badge>
                      <Badge variant="secondary">{template.sections.length} sections</Badge>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="icon">
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SoftwareTemplateDialog;
