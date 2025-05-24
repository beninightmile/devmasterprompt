
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';

interface AddIdeaFormProps {
  onAddIdea: (content: string) => void;
}

const AddIdeaForm: React.FC<AddIdeaFormProps> = ({ onAddIdea }) => {
  const [newIdeaContent, setNewIdeaContent] = useState('');

  const handleAddIdea = () => {
    if (newIdeaContent.trim()) {
      onAddIdea(newIdeaContent.trim());
      setNewIdeaContent('');
    }
  };

  return (
    <div className="flex gap-2">
      <Textarea
        placeholder="Neue Idee oder Notiz hinzufügen..."
        value={newIdeaContent}
        onChange={(e) => setNewIdeaContent(e.target.value)}
        className="min-h-[80px]"
      />
      <Button onClick={handleAddIdea} disabled={!newIdeaContent.trim()}>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default AddIdeaForm;
