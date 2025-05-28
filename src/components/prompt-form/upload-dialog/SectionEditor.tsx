
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DetectedSection {
  name: string;
  content: string;
}

interface SectionEditorProps {
  sections: DetectedSection[];
  editableSections: DetectedSection[];
  error: string | null;
  onSectionNameChange: (index: number, newName: string) => void;
  onSectionContentChange: (index: number, newContent: string) => void;
  onSplitSection: (index: number) => void;
  onClearSections: () => void;
  onImport: () => void;
}

const SectionEditor: React.FC<SectionEditorProps> = ({
  sections,
  editableSections,
  error,
  onSectionNameChange,
  onSectionContentChange,
  onSplitSection,
  onClearSections,
  onImport,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm">
            Found <span className="font-medium">{sections.length}</span> sections
          </p>
          <p className="text-xs text-muted-foreground">
            You can edit section names and content before importing
          </p>
        </div>
        
        {error && (
          <Alert variant="default" className="py-2 px-3 border-yellow-400 bg-yellow-50 text-yellow-800">
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
                    onClick={() => onSplitSection(index)}
                    className="text-xs"
                  >
                    Auto-split section
                  </Button>
                )}
              </div>
              
              <Input
                id={`section-name-${index}`}
                value={section.name}
                onChange={(e) => onSectionNameChange(index, e.target.value)}
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
                onChange={(e) => onSectionContentChange(index, e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onClearSections}>
          Start Over
        </Button>
        <Button onClick={onImport}>
          Import {editableSections.length} Sections
        </Button>
      </div>
    </div>
  );
};

export default SectionEditor;
