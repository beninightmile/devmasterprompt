
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { parseTextIntoSections } from '@/services/prompt-parser';
import { PromptSection } from '@/types/prompt';
import FileUploadSection from './FileUploadSection';
import SectionEditor from './SectionEditor';

interface UploadContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportSections: (sections: PromptSection[]) => void;
}

interface DetectedSection {
  name: string;
  content: string;
}

const UploadContentDialog: React.FC<UploadContentDialogProps> = ({
  open,
  onOpenChange,
  onImportSections,
}) => {
  const [detectedSections, setDetectedSections] = useState<DetectedSection[]>([]);
  const [editableSections, setEditableSections] = useState<DetectedSection[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
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
        processText(text);
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
  };
  
  const processText = (text: string) => {
    try {
      const sections = parseTextIntoSections(text);
      const detectedSections = sections.map(section => ({
        name: section.name,
        content: section.content
      }));
      
      setDetectedSections(detectedSections);
      setEditableSections([...detectedSections]);
      setIsProcessing(false);
      
      // Show warning if only one section was detected from a large text
      if (sections.length === 1 && text.length > 500) {
        setError('Only one section was detected. The text structure may be complex. You can manually split the content into sections if needed.');
      } else {
        setError(null);
      }
    } catch (err) {
      setError('Error analyzing text structure');
      setIsProcessing(false);
    }
  };
  
  const handleSectionNameChange = (index: number, newName: string) => {
    const updatedSections = [...editableSections];
    updatedSections[index] = {
      ...updatedSections[index],
      name: newName
    };
    setEditableSections(updatedSections);
  };
  
  const handleSectionContentChange = (index: number, newContent: string) => {
    const updatedSections = [...editableSections];
    updatedSections[index] = {
      ...updatedSections[index],
      content: newContent
    };
    setEditableSections(updatedSections);
  };
  
  const handleImport = () => {
    // Convert DetectedSection[] to PromptSection[]
    const promptSections: PromptSection[] = editableSections.map((section, index) => ({
      id: crypto.randomUUID(),
      name: section.name,
      content: section.content,
      order: index,
      isRequired: false,
      level: 1,
      isArea: false
    }));
    
    onImportSections(promptSections);
    onOpenChange(false);
    
    // Reset state for next time
    setDetectedSections([]);
    setEditableSections([]);
  };
  
  const handleDirectTextUpload = () => {
    const textareaElement = document.getElementById('direct-text-input') as HTMLTextAreaElement;
    if (textareaElement && textareaElement.value) {
      const text = textareaElement.value;
      setIsProcessing(true);
      processText(text);
    } else {
      setError('Please enter text to process');
    }
  };
  
  const handleSplitSection = (index: number) => {
    // Create a utility function to split large sections into smaller ones
    const section = editableSections[index];
    const content = section.content;
    
    // Try to find natural break points (paragraphs)
    const paragraphs = content.split(/\n{2,}/);
    
    if (paragraphs.length <= 1) {
      setError('No natural break points found to split this section');
      return;
    }
    
    // Create new sections from paragraphs
    const newSections: DetectedSection[] = [];
    
    paragraphs.forEach((paragraph, i) => {
      if (!paragraph.trim()) return;
      
      newSections.push({
        name: `${section.name} - Part ${i + 1}`,
        content: paragraph.trim()
      });
    });
    
    // Replace the original section with the new subsections
    const updatedSections = [
      ...editableSections.slice(0, index),
      ...newSections,
      ...editableSections.slice(index + 1)
    ];
    
    setEditableSections(updatedSections);
  };
  
  const handleClearSections = () => {
    setDetectedSections([]);
    setEditableSections([]);
    setError(null);
  };
  
  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) {
        handleClearSections();
      }
      onOpenChange(newOpen);
    }}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Upload and Parse Content</DialogTitle>
        </DialogHeader>
        
        {detectedSections.length === 0 ? (
          <FileUploadSection
            onTextParsed={processText}
            error={error}
            isProcessing={isProcessing}
            onFileChange={handleFileChange}
            onDirectTextUpload={handleDirectTextUpload}
          />
        ) : (
          <SectionEditor
            sections={detectedSections}
            editableSections={editableSections}
            error={error}
            onSectionNameChange={handleSectionNameChange}
            onSectionContentChange={handleSectionContentChange}
            onSplitSection={handleSplitSection}
            onClearSections={handleClearSections}
            onImport={handleImport}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UploadContentDialog;
