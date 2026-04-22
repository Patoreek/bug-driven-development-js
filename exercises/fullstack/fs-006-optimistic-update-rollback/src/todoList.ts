export type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

type TodoState = {
  todos: Todo[];
  error: string | null;
};

// Simulated API that fails for specific items
export async function serverToggleTodo(id: string): Promise<{ success: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 10));
  // Simulate server failure for items containing "fail"
  if (id.includes("fail")) {
    return { success: false };
  }
  return { success: true };
}

export function createTodoStore(initialTodos: Todo[]) {
  let state: TodoState = {
    todos: [...initialTodos],
    error: null,
  };

  const listeners: Array<() => void> = [];

  function getState(): TodoState {
    return state;
  }

  function notify() {
    listeners.forEach((l) => l());
  }

  function subscribe(listener: () => void) {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index >= 0) listeners.splice(index, 1);
    };
  }

  // BUG: Optimistic update with no rollback on server failure
  async function toggleTodo(id: string) {
    // Optimistically update the UI
    state = {
      ...state,
      error: null,
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ),
    };
    notify();

    // Send to server
    const result = await serverToggleTodo(id);

    if (!result.success) {
      // BUG: Sets error message but does NOT rollback the optimistic update
      state = { ...state, error: `Failed to toggle todo ${id}` };
      notify();
    }
  }

  return { getState, subscribe, toggleTodo };
}
