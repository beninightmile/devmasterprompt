
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
  const [editableSections, setEditableSections] = useState<DetectedSection[]>([]);
  const [activeTab, setActiveTab] = useState<string>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTextParsed = useCallback((text: string) => {
    try {
      setIsProcessing(true);
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
      setEditableSections(detectedSections);
      setActiveTab('edit');
      setIsProcessing(false);
      setError(null);
    } catch (error) {
      console.error('Error parsing text:', error);
      setError('Error parsing text structure');
      setIsProcessing(false);
    }
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
      setError('Please upload a plain text (.txt) file');
      return;
    }
    
    setError(null);
    setIsProcessing(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        handleTextParsed(text);
      } catch (err) {
        setError('Failed to process the text file');
        setIsProcessing(false);
      }
    };
    
    reader.onerror = () => {
      setError('Failed to read the file');
      setIsProcessing(false);
    };
    
    reader.readAsText(file);
  }, [handleTextParsed]);

  const handleDirectTextUpload = useCallback(() => {
    const textareaElement = document.getElementById('direct-text-input') as HTMLTextAreaElement;
    if (textareaElement && textareaElement.value) {
      const text = textareaElement.value;
      handleTextParsed(text);
    } else {
      setError('Please enter text to process');
    }
  }, [handleTextParsed]);

  const handleSectionNameChange = useCallback((index: number, newName: string) => {
    const updatedSections = [...editableSections];
    updatedSections[index] = {
      ...updatedSections[index],
      name: newName
    };
    setEditableSections(updatedSections);
    
    // Also update parsedSections
    const updatedParsedSections = [...parsedSections];
    if (updatedParsedSections[index]) {
      updatedParsedSections[index] = {
        ...updatedParsedSections[index],
        name: newName
      };
      setParsedSections(updatedParsedSections);
    }
  }, [editableSections, parsedSections]);

  const handleSectionContentChange = useCallback((index: number, newContent: string) => {
    const updatedSections = [...editableSections];
    updatedSections[index] = {
      ...updatedSections[index],
      content: newContent
    };
    setEditableSections(updatedSections);
    
    // Also update parsedSections
    const updatedParsedSections = [...parsedSections];
    if (updatedParsedSections[index]) {
      updatedParsedSections[index] = {
        ...updatedParsedSections[index],
        content: newContent
      };
      setParsedSections(updatedParsedSections);
    }
  }, [editableSections, parsedSections]);

  const handleSplitSection = useCallback((index: number) => {
    const section = editableSections[index];
    const content = section.content;
    
    const paragraphs = content.split(/\n{2,}/);
    
    if (paragraphs.length <= 1) {
      setError('No natural break points found to split this section');
      return;
    }
    
    const newSections: DetectedSection[] = [];
    
    paragraphs.forEach((paragraph, i) => {
      if (!paragraph.trim()) return;
      
      newSections.push({
        name: `${section.name} - Part ${i + 1}`,
        content: paragraph.trim()
      });
    });
    
    const updatedSections = [
      ...editableSections.slice(0, index),
      ...newSections,
      ...editableSections.slice(index + 1)
    ];
    
    setEditableSections(updatedSections);
    
    // Also update parsedSections
    const newParsedSections: PromptSection[] = newSections.map((s, i) => ({
      id: crypto.randomUUID(),
      name: s.name,
      content: s.content,
      order: index + i,
      isRequired: false,
      level: 1,
      isArea: false
    }));
    
    const updatedParsedSections = [
      ...parsedSections.slice(0, index),
      ...newParsedSections,
      ...parsedSections.slice(index + 1)
    ];
    
    setParsedSections(updatedParsedSections);
  }, [editableSections, parsedSections]);

  const handleClearSections = useCallback(() => {
    setParsedSections([]);
    setEditableSections([]);
    setError(null);
    setActiveTab('upload');
  }, []);

  const handleImport = useCallback(() => {
    onImportSections(parsedSections);
    setParsedSections([]);
    setEditableSections([]);
    setActiveTab('upload');
  }, [parsedSections, onImportSections]);

  const handleDialogClose = useCallback((open: boolean) => {
    if (!open) {
      setParsedSections([]);
      setEditableSections([]);
      setActiveTab('upload');
      setError(null);
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
            <FileUploadSection 
              onTextParsed={handleTextParsed}
              error={error}
              isProcessing={isProcessing}
              onFileChange={handleFileChange}
              onDirectTextUpload={handleDirectTextUpload}
            />
          </TabsContent>
          
          <TabsContent value="edit" className="space-y-4">
            <SectionEditor 
              sections={editableSections}
              editableSections={editableSections}
              error={error}
              onSectionNameChange={handleSectionNameChange}
              onSectionContentChange={handleSectionContentChange}
              onSplitSection={handleSplitSection}
              onClearSections={handleClearSections}
              onImport={handleImport}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default UploadPromptDialog;
