
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { getModelCompatibility } from '@/services/prompt-service';

interface ModelCompatibilityProps {
  tokenCount: number;
}

const ModelCompatibility: React.FC<ModelCompatibilityProps> = ({ tokenCount }) => {
  const compatibility = getModelCompatibility(tokenCount);
  
  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {compatibility.map(model => (
        <Badge 
          key={model.model} 
          variant={model.isCompatible ? "outline" : "destructive"}
          className={model.isCompatible ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400" : ""}
        >
          {model.model} {model.isCompatible ? '✓' : '✗'} 
          <span className="ml-1 text-muted-foreground">
            ({Math.round(tokenCount / model.maxTokens * 100)}%)
          </span>
        </Badge>
      ))}
    </div>
  );
};

export default ModelCompatibility;
