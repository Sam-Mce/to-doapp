'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import Todo from './Todo';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  category: string;
  priority?: string;
  description?: string;
}

type FilterType = 'all' | 'active' | 'completed';

export default function TodoList() {
  const { data: session } = useSession();
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState('other');
  const [filter, setFilter] = useState<FilterType>('active');

  const fetchTodos = useCallback(async () => {
    if (!session?.user?.email) return;
    
    try {
      const response = await fetch('/api/todos');
      const data = await response.json();
      if (data.todos) {
        setTodos(data.todos);
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.email]);

  useEffect(() => {
    if (session?.user?.email) {
      fetchTodos();
    }
  }, [session?.user?.email, fetchTodos]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        const input = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (input) {
          input.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim() || !session?.user?.email) return;

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: newTodo.trim(),
          category,
          priority: '9/10',
          description: 'Developing a To-Do List web app is important for organization and productivity. Completing this task will enhance efficiency in managing tasks. However, the urgency may vary depending on deadlines for other projects.'
        }),
      });

      const data = await response.json();
      if (data) {
        setTodos([...todos, data]);
        setNewTodo('');
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (!todo) return;

      const response = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: !todo.completed,
        }),
      });

      if (response.ok) {
        setTodos(todos.map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
      }
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTodos(todos.filter(todo => todo.id !== id));
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <div className="text-center text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl mx-auto"
    >
      <h1 className="text-4xl font-bold text-white text-center mb-8">My To-Do List ✨</h1>

      <form onSubmit={addTodo} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task (Cmd+N)"
            className="flex-grow p-3 text-center bg-[#151922] text-white rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 shadow-lg"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 bg-[#151922] text-white rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 shadow-lg"
          >
            <option value="other">📌</option>
            <option value="work">💼</option>
            <option value="personal">🏠</option>
            <option value="shopping">🛒</option>
          </select>
          <button
            type="submit"
            className="px-6 py-3 bg-[#6b46c1] text-white rounded-lg font-medium hover:bg-[#553c9a] focus:outline-none shadow-lg shadow-[#6b46c1]/20"
          >
            Add
          </button>
        </div>
      </form>

      <div className="flex justify-center gap-2 mb-6">
        {(['all', 'active', 'completed'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors shadow-lg ${
              filter === type
                ? 'bg-[#6b46c1] text-white shadow-[#6b46c1]/20'
                : 'bg-[#151922] text-gray-400 hover:text-white shadow-black/20'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredTodos.map(todo => (
          <Todo
            key={todo.id}
            {...todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        ))}
      </div>

      {todos.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          <p>No todos yet. Add one above!</p>
        </div>
      )}

      <div className="text-center text-gray-500 text-sm mt-8">
        Press Cmd+N (or Ctrl+N) to quickly add a new todo
      </div>
    </motion.div>
  );
} 