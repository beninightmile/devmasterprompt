
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  SoftwareTemplate, 
  getAllSoftwareTemplates,
  getSoftwareTemplates,
  getPromptEngineeringTemplates,
  convertTemplateToSections
} from '@/services/software-templates';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Code, MessageSquare } from 'lucide-react';
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

const TemplateCard = ({ template, onSelect }: { template: SoftwareTemplate; onSelect: () => void }) => {
  const { areaCount, standardCount, sectionCount } = getTemplateStats(template);
  
  return (
    <div 
      className="border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer"
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {template.category === 'software' ? (
              <Code className="h-4 w-4 text-blue-500" />
            ) : (
              <MessageSquare className="h-4 w-4 text-purple-500" />
            )}
            <h3 className="text-lg font-semibold">{template.name}</h3>
          </div>
          <p className="text-muted-foreground text-sm mt-1">{template.description}</p>
          
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <ComplexityBadge complexity={template.complexity} />
            <Badge variant="outline">Est. {template.estimatedTime}</Badge>
            {template.category === 'software' ? (
              <>
                <Badge variant="secondary">{standardCount} Standard-Sektionen</Badge>
                <Badge variant="secondary">{areaCount} Areas</Badge>
                <Badge variant="secondary">{sectionCount} Sektionen</Badge>
              </>
            ) : (
              <>
                <Badge variant="secondary">{areaCount} Framework Areas</Badge>
                <Badge variant="secondary">{sectionCount} Components</Badge>
              </>
            )}
          </div>
        </div>
        
        <Button variant="ghost" size="icon">
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

const getTemplateStats = (template: SoftwareTemplate) => {
  const areaCount = template.sections.filter(s => s.isArea).length;
  const standardCount = template.sections.filter(s => !s.isArea && s.level === 1).length;
  const sectionCount = template.sections.filter(s => !s.isArea && s.level > 1).length;
  
  return { areaCount, standardCount, sectionCount };
};

const SoftwareTemplateDialog: React.FC<SoftwareTemplateDialogProps> = ({
  open,
  onOpenChange,
  onSelectTemplate,
}) => {
  const [activeTab, setActiveTab] = useState('software');
  const allTemplates = getAllSoftwareTemplates();
  const softwareTemplates = getSoftwareTemplates(allTemplates);
  const promptTemplates = getPromptEngineeringTemplates(allTemplates);

  const handleSelectTemplate = (template: SoftwareTemplate) => {
    const sections = convertTemplateToSections(template);
    onSelectTemplate(sections);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Vorlage auswählen</DialogTitle>
          <DialogDescription>
            Wählen Sie eine Vorlage für Software-Entwicklung oder Prompt Engineering, um mit den passenden Abschnitten zu beginnen.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="software" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Software-Entwicklung ({softwareTemplates.length})
            </TabsTrigger>
            <TabsTrigger value="prompt" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Prompt Engineering ({promptTemplates.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="software">
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4 p-1">
                {softwareTemplates.map((template) => (
                  <TemplateCard 
                    key={template.id}
                    template={template}
                    onSelect={() => handleSelectTemplate(template)}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="prompt">
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4 p-1">
                {promptTemplates.map((template) => (
                  <TemplateCard 
                    key={template.id}
                    template={template}
                    onSelect={() => handleSelectTemplate(template)}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SoftwareTemplateDialog;
