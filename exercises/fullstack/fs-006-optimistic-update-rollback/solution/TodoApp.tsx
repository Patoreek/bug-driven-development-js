"use client";

import { useState } from "react";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

// Simulated server API
export async function toggleTodoApi(
  id: string,
  completed: boolean
): Promise<{ success: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Simulate server error for specific IDs (e.g., "fail-*")
  if (id.startsWith("fail-")) {
    throw new Error("Server error: could not update todo");
  }

  return { success: true };
}

type TodoAppProps = {
  initialTodos: Todo[];
};

export function TodoApp({ initialTodos }: TodoAppProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = async (id: string) => {
    // Save previous state for rollback
    const previousTodos = todos;

    // Clear any previous error
    setError(null);

    // Optimistic update -- flip the completed status immediately
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );

    // Call server
    try {
      await toggleTodoApi(
        id,
        !todos.find((t) => t.id === id)!.completed
      );
    } catch (err) {
      // FIX: Roll back to previous state on error
      setTodos(previousTodos);
      setError(
        err instanceof Error ? err.message : "Failed to update todo"
      );
    }
  };

  return (
    <div data-testid="todo-app">
      <h2>Todo List</h2>
      {error && (
        <p data-testid="error-message" role="alert">
          {error}
        </p>
      )}
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} data-testid={`todo-${todo.id}`}>
            <label>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggle(todo.id)}
                data-testid={`checkbox-${todo.id}`}
              />
              <span
                data-testid={`text-${todo.id}`}
                style={{
                  textDecoration: todo.completed ? "line-through" : "none",
                }}
              >
                {todo.text}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
