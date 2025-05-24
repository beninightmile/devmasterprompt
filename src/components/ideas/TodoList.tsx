
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';
import type { TodoItem } from '@/types/prompt';

interface TodoListProps {
  todos: TodoItem[];
  ideaId: string;
  onAddTodo: (ideaId: string, text: string) => void;
  onUpdateTodo: (ideaId: string, todoId: string, completed: boolean) => void;
  onRemoveTodo: (ideaId: string, todoId: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  ideaId,
  onAddTodo,
  onUpdateTodo,
  onRemoveTodo,
}) => {
  const [newTodoText, setNewTodoText] = useState('');

  const handleAddTodo = () => {
    if (newTodoText.trim()) {
      onAddTodo(ideaId, newTodoText.trim());
      setNewTodoText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTodo();
    }
  };

  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <div key={todo.id} className="flex items-center gap-2 group">
          <Checkbox
            checked={todo.completed}
            onCheckedChange={(checked) => 
              onUpdateTodo(ideaId, todo.id, !!checked)
            }
          />
          <span className={`flex-1 text-sm ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
            {todo.text}
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onRemoveTodo(ideaId, todo.id)}
            className="opacity-0 group-hover:opacity-100 text-destructive h-6 w-6 p-0"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      ))}

      <div className="flex gap-2 mt-2">
        <Input
          placeholder="Neues Todo hinzufügen..."
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="text-sm"
        />
        <Button 
          size="sm" 
          onClick={handleAddTodo}
          disabled={!newTodoText.trim()}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default TodoList;
