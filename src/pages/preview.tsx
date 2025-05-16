
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePromptStore } from '@/store/promptStore';
import { generatePromptText, estimatePromptTokens } from '@/services/prompt-service';
import { Card, CardContent } from '@/components/ui/card';
import CopyButton from '@/components/CopyButton';
import { Button } from '@/components/ui/button';
import { Download, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ModelCompatibility from '@/components/ModelCompatibility';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const PreviewPage: React.FC = () => {
  const { sections, setPreviewMode } = usePromptStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  
  const promptText = generatePromptText(sections);
  const tokenEstimate = estimatePromptTokens(promptText);
  
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
    navigate('/');
  };
  
  return (
    <div className="container py-8">
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
          <CopyButton text={promptText} />
          
          <Dialog open={downloadDialogOpen} onOpenChange={setDownloadDialogOpen}>
            <Button variant="secondary" onClick={() => setDownloadDialogOpen(true)}>
              <Download size={16} className="mr-2" />
              Download
            </Button>
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
          Total tokens: <span className="font-medium">{tokenEstimate}</span>
        </div>
      </div>
      
      <ModelCompatibility tokenCount={tokenEstimate} />
      
      <Card className="overflow-hidden mt-4">
        <CardContent className="p-0">
          <div className="bg-muted p-4 border-b font-mono text-sm overflow-x-auto whitespace-pre-wrap">
            {promptText || (
              <div className="text-muted-foreground italic">
                Your prompt will appear here as you add content to each section.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreviewPage;
