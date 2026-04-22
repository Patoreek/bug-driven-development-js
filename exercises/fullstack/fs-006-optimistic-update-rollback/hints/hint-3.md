# Hint 3 (Strong)

```ts
async function toggleTodo(id: string) {
  const previousTodos = state.todos; // snapshot before optimistic update

  state = {
    ...state,
    error: null,
    todos: state.todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ),
  };
  notify();

  const result = await serverToggleTodo(id);

  if (!result.success) {
    state = { ...state, todos: previousTodos, error: `Failed to toggle todo ${id}` };
    notify();
  }
}
```
