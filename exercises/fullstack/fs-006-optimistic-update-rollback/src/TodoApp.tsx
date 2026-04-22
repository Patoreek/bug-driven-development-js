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

  // BUG: Optimistically updates but never rolls back on server error
  const handleToggle = async (id: string) => {
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
    } catch (error) {
      // BUG: Error is caught but nothing happens -- UI stays in wrong state
      console.error(error);
    }
  };

  return (
    <div data-testid="todo-app">
      <h2>Todo List</h2>
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
