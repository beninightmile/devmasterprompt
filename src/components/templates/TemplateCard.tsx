
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PromptTemplate } from '@/types/prompt';
import { formatDistanceToNow } from 'date-fns';
import { Clock, FileText, Download } from 'lucide-react';

interface TemplateCardProps {
  template: PromptTemplate;
  onLoad: (template: PromptTemplate) => void;
  onDelete: (templateId: string) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onLoad, onDelete }) => {
  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{template.name}</CardTitle>
            {template.description && (
              <CardDescription className="mt-1">{template.description}</CardDescription>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>{template.sections.length} sections</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formatDistanceToNow(template.updatedAt, { addSuffix: true })}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {template.tags && template.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {template.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="space-y-2">
          <p className="text-sm font-medium">Sections Preview:</p>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {template.sections.slice(0, 5).map((s, index) => (
              <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="bg-muted px-1.5 py-0.5 rounded text-[10px]">
                  L{s.level ?? 1}
                </span>
                <span className="truncate">{s.name}</span>
              </div>
            ))}
            {template.sections.length > 5 && (
              <p className="text-xs text-muted-foreground">
                +{template.sections.length - 5} more sections
              </p>
            )}
          </div>
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button onClick={() => onLoad(template)} className="flex-1" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Load Template
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onDelete(template.id)} 
            size="sm"
            className="text-destructive hover:text-destructive"
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateCard;
