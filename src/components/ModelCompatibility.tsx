
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { getModelCompatibility } from '@/services/prompt-service';

interface ModelCompatibilityProps {
  tokenCount: number;
}

const ModelCompatibility: React.FC<ModelCompatibilityProps> = ({
  tokenCount
}) => {
  const compatibility = getModelCompatibility(tokenCount);
  
  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {compatibility.map(model => (
        <Badge key={model.name} variant={model.compatible ? "default" : "outline"} className={model.compatible ? "" : "text-muted-foreground"}>
          {model.name}
        </Badge>
      ))}
    </div>
  );
};

export default ModelCompatibility;
