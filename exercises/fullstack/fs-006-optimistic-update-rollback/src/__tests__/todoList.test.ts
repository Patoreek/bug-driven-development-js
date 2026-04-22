import { createTodoStore, type Todo } from "../todoList";

const initialTodos: Todo[] = [
  { id: "1", text: "Buy groceries", completed: false },
  { id: "2", text: "Walk the dog", completed: true },
  { id: "fail-1", text: "This will fail", completed: false },
];

describe("Todo optimistic update with rollback", () => {
  it("starts with initial todos", () => {
    const store = createTodoStore(initialTodos);
    expect(store.getState().todos).toHaveLength(3);
    expect(store.getState().error).toBeNull();
  });

  it("optimistically toggles a todo immediately", async () => {
    const store = createTodoStore(initialTodos);
    const promise = store.toggleTodo("1");

    // Should be toggled immediately (optimistic)
    expect(store.getState().todos[0].completed).toBe(true);

    await promise;
  });

  it("keeps the toggle on server success", async () => {
    const store = createTodoStore(initialTodos);
    await store.toggleTodo("1");

    expect(store.getState().todos[0].completed).toBe(true);
    expect(store.getState().error).toBeNull();
  });

  it("rolls back the toggle on server failure", async () => {
    const store = createTodoStore(initialTodos);

    // fail-1 starts as completed: false
    expect(store.getState().todos[2].completed).toBe(false);

    await store.toggleTodo("fail-1");

    // Should be rolled back to false after server failure
    expect(store.getState().todos[2].completed).toBe(false);
    expect(store.getState().error).toContain("fail-1");
  });

  it("sets error message on server failure", async () => {
    const store = createTodoStore(initialTodos);
    await store.toggleTodo("fail-1");

    expect(store.getState().error).toBeDefined();
    expect(store.getState().error).toContain("Failed to toggle");
  });

  it("notifies listeners on optimistic update and rollback", async () => {
    const store = createTodoStore(initialTodos);
    const listener = vi.fn();
    store.subscribe(listener);

    await store.toggleTodo("fail-1");

    // Should be called at least twice: once for optimistic update, once for rollback
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it("does not affect other todos on rollback", async () => {
    const store = createTodoStore(initialTodos);
    await store.toggleTodo("fail-1");

    expect(store.getState().todos[0].completed).toBe(false);
    expect(store.getState().todos[1].completed).toBe(true);
  });

  it("unsubscribe stops listener from being called", async () => {
    const store = createTodoStore(initialTodos);
    const listener = vi.fn();
    const unsub = store.subscribe(listener);

    unsub();
    await store.toggleTodo("1");

    expect(listener).not.toHaveBeenCalled();
  });
});
