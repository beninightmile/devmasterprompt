
import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FileUploadSection from './FileUploadSection';
import SectionEditor from './SectionEditor';
import { parseTextIntoSections } from '@/services/prompt-parser/text-parser';
import { PromptSection } from '@/types/prompt';
import { DetectedSection } from '@/services/prompt-parser/types';

interface UploadPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportSections: (sections: PromptSection[]) => void;
}

const UploadPromptDialog: React.FC<UploadPromptDialogProps> = ({
  open,
  onOpenChange,
  onImportSections,
}) => {
  const [parsedSections, setParsedSections] = useState<PromptSection[]>([]);
  const [activeTab, setActiveTab] = useState<string>('upload');

  const handleTextParsed = useCallback((text: string) => {
    try {
      const detectedSections: DetectedSection[] = parseTextIntoSections(text);
      // Convert DetectedSection to PromptSection
      const sections: PromptSection[] = detectedSections.map((section, index) => ({
        id: section.id || crypto.randomUUID(),
        name: section.name,
        content: section.content,
        order: section.order ?? index,
        isRequired: section.isRequired ?? false,
        level: section.level ?? 1,
        parentId: section.parentId,
        isArea: section.isArea ?? false,
      }));
      setParsedSections(sections);
      setActiveTab('edit');
    } catch (error) {
      console.error('Error parsing text:', error);
    }
  }, []);

  const handleSectionsUpdate = useCallback((sections: PromptSection[]) => {
    setParsedSections(sections);
  }, []);

  const handleImport = useCallback(() => {
    onImportSections(parsedSections);
    setParsedSections([]);
    setActiveTab('upload');
  }, [parsedSections, onImportSections]);

  const handleDialogClose = useCallback((open: boolean) => {
    if (!open) {
      setParsedSections([]);
      setActiveTab('upload');
    }
    onOpenChange(open);
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Import Content</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload & Parse</TabsTrigger>
            <TabsTrigger value="edit" disabled={parsedSections.length === 0}>
              Edit Sections ({parsedSections.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4">
            <FileUploadSection onTextParsed={handleTextParsed} />
          </TabsContent>
          
          <TabsContent value="edit" className="space-y-4">
            <SectionEditor 
              sections={parsedSections}
              onSectionsUpdate={handleSectionsUpdate}
              onImport={handleImport}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default UploadPromptDialog;
