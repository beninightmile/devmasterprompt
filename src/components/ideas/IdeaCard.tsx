
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit3, Trash2, Calendar } from 'lucide-react';
import type { IdeaNote } from '@/types/prompt';
import TodoList from './TodoList';

interface IdeaCardProps {
  idea: IdeaNote;
  onUpdateIdea: (id: string, updates: Partial<IdeaNote>) => void;
  onRemoveIdea: (id: string) => void;
  onAddTodo: (ideaId: string, text: string) => void;
  onUpdateTodo: (ideaId: string, todoId: string, completed: boolean) => void;
  onRemoveTodo: (ideaId: string, todoId: string) => void;
}

const IdeaCard: React.FC<IdeaCardProps> = ({
  idea,
  onUpdateIdea,
  onRemoveIdea,
  onAddTodo,
  onUpdateTodo,
  onRemoveTodo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingContent, setEditingContent] = useState('');

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const handleEditIdea = () => {
    setIsEditing(true);
    setEditingContent(idea.content);
  };

  const handleSaveEdit = () => {
    if (editingContent.trim()) {
      onUpdateIdea(idea.id, { content: editingContent.trim() });
      setIsEditing(false);
      setEditingContent('');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingContent('');
  };

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Idea content */}
          <div className="flex items-start justify-between gap-2">
            {isEditing ? (
              <div className="flex-1 space-y-2">
                <Textarea
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  className="min-h-[60px]"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveEdit}>
                    Speichern
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                    Abbrechen
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1">
                  <p className="text-sm">{idea.content}</p>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleEditIdea}
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onRemoveIdea(idea.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Timestamp */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Erstellt: {formatDate(idea.createdAt)}</span>
            {idea.updatedAt.getTime() !== idea.createdAt.getTime() && (
              <span>• Aktualisiert: {formatDate(idea.updatedAt)}</span>
            )}
          </div>

          {/* Todo list */}
          <TodoList
            todos={idea.todos}
            ideaId={idea.id}
            onAddTodo={onAddTodo}
            onUpdateTodo={onUpdateTodo}
            onRemoveTodo={onRemoveTodo}
          />

          {/* Todo stats */}
          {idea.todos.length > 0 && (
            <div className="flex gap-2">
              <Badge variant="secondary" className="text-xs">
                {idea.todos.filter(t => t.completed).length}/{idea.todos.length} erledigt
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IdeaCard;
