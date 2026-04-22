import { useState, useCallback, useMemo, memo } from "react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const INITIAL_TODOS: Todo[] = [
  { id: 1, text: "Review pull request", completed: false },
  { id: 2, text: "Update documentation", completed: true },
  { id: 3, text: "Fix login bug", completed: false },
  { id: 4, text: "Deploy to staging", completed: false },
  { id: 5, text: "Write unit tests", completed: true },
];

// Track render counts for testing
let todoItemRenderCount = 0;

export function getTodoItemRenderCount() {
  return todoItemRenderCount;
}

export function resetTodoItemRenderCount() {
  todoItemRenderCount = 0;
}

const TodoItem = memo(function TodoItem({
  todo,
  onToggle,
}: {
  todo: Todo;
  onToggle: (id: number) => void;
}) {
  todoItemRenderCount++;

  return (
    <li data-testid={`todo-${todo.id}`}>
      <label>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
        <span style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
          {todo.text}
        </span>
      </label>
    </li>
  );
});

export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>(INITIAL_TODOS);
  const [search, setSearch] = useState("");

  const toggleTodo = useCallback((id: number) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const filteredTodos = useMemo(
    () =>
      todos.filter((t) =>
        t.text.toLowerCase().includes(search.toLowerCase())
      ),
    [todos, search]
  );

  return (
    <div>
      <h2>Todo List</h2>
      <input
        data-testid="search-input"
        type="text"
        placeholder="Search todos..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ul>
        {filteredTodos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} />
        ))}
      </ul>
      <p data-testid="todo-count">Showing {filteredTodos.length} todos</p>
    </div>
  );
}
