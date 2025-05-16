
import React from 'react';
import { usePromptStore } from '@/store/promptStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PromptPreview: React.FC = () => {
  const { sections } = usePromptStore();
  const { toast } = useToast();
  
  // Sort sections by order
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);
  
  // Generate final prompt text
  const promptText = sortedSections
    .filter(section => section.content.trim() !== '')
    .map(section => {
      return `## ${section.name}\n${section.content}\n`;
    })
    .join('\n');
    
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
  
  const handleDownload = () => {
    const blob = new Blob([promptText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'prompt.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Prompt Preview</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleCopyToClipboard}>
            <Copy size={16} className="mr-2" />
            Copy Prompt
          </Button>
          <Button variant="secondary" onClick={handleDownload}>
            <Download size={16} className="mr-2" />
            Download
          </Button>
        </div>
      </div>
      
      <Card className="p-6 whitespace-pre-wrap font-mono bg-card border">
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
