
import React, { useState } from 'react';
import { usePromptStore } from '@/store/promptStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Edit3, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Ideas: React.FC = () => {
  const { ideas, addIdea, updateIdea, removeIdea, addTodoToIdea, updateTodo, removeTodo } = usePromptStore();
  const [newIdeaContent, setNewIdeaContent] = useState('');
  const [editingIdea, setEditingIdea] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [newTodoText, setNewTodoText] = useState<{ [key: string]: string }>({});

  const handleAddIdea = () => {
    if (newIdeaContent.trim()) {
      addIdea(newIdeaContent.trim());
      setNewIdeaContent('');
    }
  };

  const handleEditIdea = (ideaId: string) => {
    const idea = ideas.find(i => i.id === ideaId);
    if (idea) {
      setEditingIdea(ideaId);
      setEditingContent(idea.content);
    }
  };

  const handleSaveEdit = () => {
    if (editingIdea && editingContent.trim()) {
      updateIdea(editingIdea, { content: editingContent.trim() });
      setEditingIdea(null);
      setEditingContent('');
    }
  };

  const handleCancelEdit = () => {
    setEditingIdea(null);
    setEditingContent('');
  };

  const handleAddTodo = (ideaId: string) => {
    const todoText = newTodoText[ideaId];
    if (todoText?.trim()) {
      addTodoToIdea(ideaId, todoText.trim());
      setNewTodoText({ ...newTodoText, [ideaId]: '' });
    }
  };

  const handleToggleTodo = (ideaId: string, todoId: string, completed: boolean) => {
    updateTodo(ideaId, todoId, { completed });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Ideas & Todo-Listen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add new idea */}
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

          {/* Ideas list */}
          <div className="space-y-4">
            {ideas.map((idea) => (
              <Card key={idea.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Idea content */}
                    <div className="flex items-start justify-between gap-2">
                      {editingIdea === idea.id ? (
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
                              onClick={() => handleEditIdea(idea.id)}
                            >
                              <Edit3 className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeIdea(idea.id)}
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
                    <div className="space-y-2">
                      {idea.todos.map((todo) => (
                        <div key={todo.id} className="flex items-center gap-2 group">
                          <Checkbox
                            checked={todo.completed}
                            onCheckedChange={(checked) => 
                              handleToggleTodo(idea.id, todo.id, !!checked)
                            }
                          />
                          <span className={`flex-1 text-sm ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {todo.text}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeTodo(idea.id, todo.id)}
                            className="opacity-0 group-hover:opacity-100 text-destructive h-6 w-6 p-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}

                      {/* Add new todo */}
                      <div className="flex gap-2 mt-2">
                        <Input
                          placeholder="Neues Todo hinzufügen..."
                          value={newTodoText[idea.id] || ''}
                          onChange={(e) => setNewTodoText({ ...newTodoText, [idea.id]: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleAddTodo(idea.id);
                            }
                          }}
                          className="text-sm"
                        />
                        <Button 
                          size="sm" 
                          onClick={() => handleAddTodo(idea.id)}
                          disabled={!newTodoText[idea.id]?.trim()}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

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
            ))}
          </div>

          {ideas.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Edit3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Noch keine Ideen vorhanden.</p>
              <p className="text-sm">Fügen Sie oben eine neue Idee hinzu!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Ideas;
