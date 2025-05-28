
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { PromptSection } from '@/types/prompt';

interface SectionEditorProps {
  sections: PromptSection[];
  onSectionsUpdate: (sections: PromptSection[]) => void;
  onImport: () => void;
}

const SectionEditor: React.FC<SectionEditorProps> = ({
  sections,
  onSectionsUpdate,
  onImport,
}) => {
  const handleSectionNameChange = (index: number, newName: string) => {
    const updatedSections = [...sections];
    updatedSections[index] = {
      ...updatedSections[index],
      name: newName
    };
    onSectionsUpdate(updatedSections);
  };

  const handleSectionContentChange = (index: number, newContent: string) => {
    const updatedSections = [...sections];
    updatedSections[index] = {
      ...updatedSections[index],
      content: newContent
    };
    onSectionsUpdate(updatedSections);
  };

  const handleSplitSection = (index: number) => {
    const section = sections[index];
    const content = section.content;
    
    // Try to find natural break points (paragraphs)
    const paragraphs = content.split(/\n{2,}/);
    
    if (paragraphs.length <= 1) {
      return;
    }
    
    // Create new sections from paragraphs
    const newSections: PromptSection[] = [];
    
    paragraphs.forEach((paragraph, i) => {
      if (!paragraph.trim()) return;
      
      newSections.push({
        ...section,
        id: crypto.randomUUID(),
        name: `${section.name} - Part ${i + 1}`,
        content: paragraph.trim()
      });
    });
    
    // Replace the original section with the new subsections
    const updatedSections = [
      ...sections.slice(0, index),
      ...newSections,
      ...sections.slice(index + 1)
    ];
    
    onSectionsUpdate(updatedSections);
  };

  const handleClearSections = () => {
    onSectionsUpdate([]);
  };

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
      </div>
      
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-6">
          {sections.map((section, index) => (
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
      
      <div className="flex justify-between">
        <div>
          <Button variant="outline" onClick={handleClearSections}>
            Start Over
          </Button>
        </div>
        <div>
          <Button onClick={onImport}>
            Import {sections.length} Sections
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SectionEditor;
