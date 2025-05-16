
import React, { useState } from 'react';
import { usePromptStore } from '@/store/promptStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Download, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { estimatePromptTokens } from '@/services/prompt-service';
import ModelCompatibility from './ModelCompatibility';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { DialogTrigger } from '@radix-ui/react-dialog';

const PromptPreview: React.FC = () => {
  const { sections, setPreviewMode } = usePromptStore();
  const { toast } = useToast();
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  
  // Sort sections by order
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);
  
  // Generate final prompt text
  const promptText = sortedSections
    .filter(section => section.content.trim() !== '')
    .map(section => {
      return `## ${section.name}\n${section.content}\n`;
    })
    .join('\n');
  
  // Calculate total tokens
  const totalTokens = estimatePromptTokens(promptText);
    
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(promptText)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: "You can now paste this prompt wherever you need it.",
        });
      })
      .catch(() => {
        toast({
          title: "Failed to copy",
          description: "Please try again or copy manually.",
          variant: "destructive",
        });
      });
  };
  
  const handleDownload = (fileType: 'md' | 'txt') => {
    const extension = fileType;
    const mimeType = fileType === 'md' ? 'text/markdown' : 'text/plain';
    const blob = new Blob([promptText], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prompt.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloadDialogOpen(false);
    
    toast({
      title: "Downloaded successfully",
      description: `Your prompt has been downloaded as a ${fileType === 'md' ? 'Markdown' : 'Text'} file.`,
    });
  };

  const handleBackToEditor = () => {
    setPreviewMode(false);
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBackToEditor}
            className="mr-4"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Editor
          </Button>
          <h1 className="text-2xl font-bold">Prompt Preview</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleCopyToClipboard}>
            <Copy size={16} className="mr-2" />
            Copy Prompt
          </Button>
          
          <Dialog open={downloadDialogOpen} onOpenChange={setDownloadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary">
                <Download size={16} className="mr-2" />
                Download
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Choose File Format</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <Button onClick={() => handleDownload('md')} variant="outline" className="flex flex-col items-center p-6">
                  <span className="font-medium mb-2">Markdown</span>
                  <span className="text-sm text-muted-foreground">.md</span>
                </Button>
                <Button onClick={() => handleDownload('txt')} variant="outline" className="flex flex-col items-center p-6">
                  <span className="font-medium mb-2">Plain Text</span>
                  <span className="text-sm text-muted-foreground">.txt</span>
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4 text-sm text-muted-foreground">
        <div>
          Sections: {sections.filter(s => s.content.trim() !== '').length}/{sections.length}
        </div>
        <div>
          Total tokens: <span className="font-medium">{totalTokens}</span>
        </div>
      </div>
      
      <ModelCompatibility tokenCount={totalTokens} />
      
      <Card className="p-6 whitespace-pre-wrap font-mono bg-card border mt-4">
        {promptText || (
          <div className="text-muted-foreground italic">
            Your prompt will appear here as you add content to each section.
          </div>
        )}
      </Card>
    </div>
  );
};

export default PromptPreview;
