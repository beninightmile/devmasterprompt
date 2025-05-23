
import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Clock, Calendar, Trash2 } from 'lucide-react';
import { PromptTemplate } from '@/types/prompt';
import { getNonEmptySectionsCount } from '@/services/prompt-service';
import ModelCompatibility from '@/components/ModelCompatibility';

interface TemplateCardProps {
  template: PromptTemplate;
  onDelete: (id: string) => void;
  onLoad: (id: string) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onDelete, onLoad }) => {
  // Calculate counts for areas and different section types
  const standardSections = template.sections.filter(s => !s.isArea && s.level === 1);
  const areas = template.sections.filter(s => s.isArea);
  const childSections = template.sections.filter(s => !s.isArea && s.level > 1);
  
  const filledSections = getNonEmptySectionsCount(template.sections);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{template.name}</CardTitle>
        {template.description && (
          <CardDescription>{template.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground mb-4">
          <div className="flex items-center mb-1">
            <Calendar size={14} className="mr-2" />
            Erstellt: {format(new Date(template.createdAt), 'PP')}
          </div>
          <div className="flex items-center">
            <Clock size={14} className="mr-2" />
            Aktualisiert: {format(new Date(template.updatedAt), 'PP')}
          </div>
        </div>
        <div className="text-sm space-y-1">
          <div className="flex flex-col gap-1">
            <p>
              {standardSections.length} Standard-Sektionen
            </p>
            <p>
              {areas.length} Areas
            </p>
            <p>
              {childSections.length} Unter-Sektionen
            </p>
            <p className="font-medium mt-1">
              {filledSections} von {template.sections.length} Sektionen mit Inhalt
            </p>
          </div>
          {template.totalTokens && (
            <p className="font-medium mt-2">
              {template.totalTokens} Tokens
            </p>
          )}
        </div>
        {template.tags && template.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {template.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        {template.totalTokens && template.totalTokens > 0 && (
          <div className="mt-4">
            <ModelCompatibility tokenCount={template.totalTokens} />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={() => onDelete(template.id)}>
          <Trash2 size={14} className="mr-2" />
          Löschen
        </Button>
        <Button size="sm" onClick={() => onLoad(template.id)}>
          Vorlage verwenden
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TemplateCard;
