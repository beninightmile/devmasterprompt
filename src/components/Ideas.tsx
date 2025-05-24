
import React from 'react';
import { usePromptStore } from '@/store/promptStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit3 } from 'lucide-react';
import AddIdeaForm from './ideas/AddIdeaForm';
import IdeaCard from './ideas/IdeaCard';

const Ideas: React.FC = () => {
  const { 
    ideas, 
    addIdea, 
    updateIdea, 
    removeIdea, 
    addTodoToIdea, 
    updateTodo, 
    removeTodo 
  } = usePromptStore();

  const handleToggleTodo = (ideaId: string, todoId: string, completed: boolean) => {
    updateTodo(ideaId, todoId, { completed });
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
          <AddIdeaForm onAddIdea={addIdea} />

          {/* Ideas list */}
          <div className="space-y-4">
            {ideas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onUpdateIdea={updateIdea}
                onRemoveIdea={removeIdea}
                onAddTodo={addTodoToIdea}
                onUpdateTodo={handleToggleTodo}
                onRemoveTodo={removeTodo}
              />
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
