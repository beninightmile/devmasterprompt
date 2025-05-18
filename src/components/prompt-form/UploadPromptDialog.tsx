
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { parseTextIntoSections, matchWithDefaultSections } from '@/services/prompt-parser-service';
import { PromptSection } from '@/types/prompt';

interface UploadPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportSections: (sections: PromptSection[]) => void;
}

interface DetectedSection {
  name: string;
  content: string;
}

const UploadPromptDialog: React.FC<UploadPromptDialogProps> = ({
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
        const sections = parseTextIntoSections(text);
        setDetectedSections(sections);
        setEditableSections([...sections]);
        setIsProcessing(false);
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
    // Match with default sections and generate proper section objects
    const mappedSections = matchWithDefaultSections(editableSections);
    onImportSections(mappedSections);
    onOpenChange(false);
    
    // Reset state for next time
    setDetectedSections([]);
    setEditableSections([]);
  };
  
  const handleDirectTextUpload = () => {
    const textareaElement = document.getElementById('direct-text-input') as HTMLTextAreaElement;
    if (textareaElement && textareaElement.value) {
      const text = textareaElement.value;
      const sections = parseTextIntoSections(text);
      setDetectedSections(sections);
      setEditableSections([...sections]);
    }
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
          <DialogTitle>Upload and Parse Prompt Text</DialogTitle>
        </DialogHeader>
        
        {detectedSections.length === 0 ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt-file">Upload Text File</Label>
              <Input
                id="prompt-file"
                type="file"
                accept=".txt,text/plain"
                onChange={handleFileChange}
                disabled={isProcessing}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="direct-text-input">Or Paste Text Directly</Label>
              <Textarea
                id="direct-text-input"
                placeholder="Paste your prompt text here..."
                className="min-h-[200px]"
              />
              <Button onClick={handleDirectTextUpload} disabled={isProcessing}>
                Process Text
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Found {detectedSections.length} sections. You can edit the section names and content below.
            </p>
            
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-6">
                {editableSections.map((section, index) => (
                  <div key={index} className="space-y-2 border-b pb-4">
                    <Label htmlFor={`section-name-${index}`}>Section Name</Label>
                    <Input
                      id={`section-name-${index}`}
                      value={section.name}
                      onChange={(e) => handleSectionNameChange(index, e.target.value)}
                    />
                    
                    <Label htmlFor={`section-content-${index}`}>Content</Label>
                    <Textarea
                      id={`section-content-${index}`}
                      value={section.content}
                      onChange={(e) => handleSectionContentChange(index, e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <DialogFooter className="flex justify-between">
              <div>
                <Button variant="outline" onClick={handleClearSections}>
                  Start Over
                </Button>
              </div>
              <div>
                <Button onClick={handleImport}>
                  Import {editableSections.length} Sections
                </Button>
              </div>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UploadPromptDialog;
