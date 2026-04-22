import { useState } from "react";

export interface Todo {
  id: string;
  text: string;
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: "a1", text: "Buy groceries" },
    { id: "b2", text: "Walk the dog" },
    { id: "c3", text: "Read a book" },
  ]);
  const [newTodo, setNewTodo] = useState("");

  const addTodo = () => {
    if (!newTodo.trim()) return;
    const todo: Todo = {
      id: crypto.randomUUID(),
      text: newTodo.trim(),
    };
    setTodos([...todos, todo]);
    setNewTodo("");
  };

  const removeTodo = (id: string) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  return (
    <div>
      <h1>Todo List</h1>
      <div>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a todo..."
          aria-label="New todo"
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul>
        {todos.map((todo, index) => (
          <li key={index} data-testid={`todo-${todo.id}`}>
            <input type="checkbox" aria-label={`Complete ${todo.text}`} />
            <span>{todo.text}</span>
            <button onClick={() => removeTodo(todo.id)} aria-label={`Remove ${todo.text}`}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
