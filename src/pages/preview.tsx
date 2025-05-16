
import React from 'react';
import { usePromptStore } from '@/store/promptStore';
import { generatePromptText, estimatePromptTokens } from '@/services/prompt-service';
import { Card, CardContent } from '@/components/ui/card';
import CopyButton from '@/components/CopyButton';
import { Button } from '@/components/ui/button';
import { Download, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PreviewPage: React.FC = () => {
  const { sections, setPreviewMode } = usePromptStore();
  const { toast } = useToast();
  
  const promptText = generatePromptText(sections);
  const tokenEstimate = estimatePromptTokens(promptText);
  
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
    
    toast({
      title: "Downloaded successfully",
      description: "Your prompt has been downloaded as a Markdown file.",
    });
  };
  
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setPreviewMode(false)}
            className="mr-4"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Editor
          </Button>
          <h1 className="text-2xl font-bold">Prompt Preview</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <CopyButton text={promptText} />
          <Button variant="secondary" onClick={handleDownload}>
            <Download size={16} className="mr-2" />
            Download
          </Button>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4 text-sm text-muted-foreground">
        <div>
          Sections: {sections.filter(s => s.content.trim() !== '').length}/{sections.length}
        </div>
        <div>
          Estimated tokens: ~{tokenEstimate}
        </div>
      </div>
      
      <Card className="overflow-hidden">
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
