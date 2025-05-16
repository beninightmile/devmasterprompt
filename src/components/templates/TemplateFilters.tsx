
import React from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Tag } from 'lucide-react';

interface TemplateFiltersProps {
  searchTerm: string;
  selectedTag: string | null;
  popularTags: string[];
  onSearchChange: (value: string) => void;
  onTagSelect: (tag: string | null) => void;
}

const TemplateFilters: React.FC<TemplateFiltersProps> = ({ 
  searchTerm, 
  selectedTag,
  popularTags,
  onSearchChange,
  onTagSelect
}) => {
  return (
    <>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search templates"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {selectedTag && (
            <Badge variant="secondary" className="flex items-center gap-2">
              <Tag size={12} />
              {selectedTag}
              <button 
                onClick={() => onTagSelect(null)}
                className="ml-1 text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      </div>
      
      {popularTags.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center mb-2 text-sm text-muted-foreground">
            <Tag size={14} className="mr-2" />
            <span>Popular Tags:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularTags.map(tag => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => onTagSelect(selectedTag === tag ? null : tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default TemplateFilters;
