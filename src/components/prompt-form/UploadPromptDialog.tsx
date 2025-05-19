
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
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
      setDetectedSections(sections);
      setEditableSections([...sections]);
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
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">The parser can detect sections based on:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Markdown headings (## Section Name)</li>
                <li>Numbered sections (1. Section Name)</li>
                <li>Special prefixes (@Core_1: Section)</li>
                <li>Colon-separated titles (Section Name: content)</li>
                <li>Paragraphs with distinct formatting</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">
                  Found <span className="font-medium">{detectedSections.length}</span> sections
                </p>
                <p className="text-xs text-muted-foreground">
                  You can edit section names and content before importing
                </p>
              </div>
              
              {error && (
                <Alert variant="default" className="py-2 px-3 border-yellow-400 bg-yellow-50 text-yellow-800">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">{error}</AlertDescription>
                </Alert>
              )}
            </div>
            
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-6">
                {editableSections.map((section, index) => (
                  <div key={index} className="space-y-2 border-b pb-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`section-name-${index}`}>Section Name</Label>
                      {section.content.length > 500 && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleSplitSection(index)}
                          className="text-xs"
                        >
                          Auto-split section
                        </Button>
                      )}
                    </div>
                    
                    <Input
                      id={`section-name-${index}`}
                      value={section.name}
                      onChange={(e) => handleSectionNameChange(index, e.target.value)}
                    />
                    
                    <Label htmlFor={`section-content-${index}`} className="flex items-center">
                      <span>Content</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({section.content.length} characters)
                      </span>
                    </Label>
                    
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
