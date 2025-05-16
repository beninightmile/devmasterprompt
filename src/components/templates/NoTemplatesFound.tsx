
import React from 'react';
import { Button } from '@/components/ui/button';

interface NoTemplatesFoundProps {
  onClearFilters: () => void;
}

const NoTemplatesFound: React.FC<NoTemplatesFoundProps> = ({ onClearFilters }) => {
  return (
    <div className="text-center py-12">
      <p className="text-muted-foreground mb-4">No templates found</p>
      <Button variant="outline" onClick={onClearFilters}>
        Clear filters
      </Button>
    </div>
  );
};

export default NoTemplatesFound;
