
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface FileUploadSectionProps {
  onTextParsed: (text: string) => void;
  error: string | null;
  isProcessing: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDirectTextUpload: () => void;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  error,
  isProcessing,
  onFileChange,
  onDirectTextUpload,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="prompt-file">Upload Text File</Label>
        <Input
          id="prompt-file"
          type="file"
          accept=".txt,text/plain"
          onChange={onFileChange}
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
        <Button onClick={onDirectTextUpload} disabled={isProcessing}>
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
  );
};

export default FileUploadSection;
