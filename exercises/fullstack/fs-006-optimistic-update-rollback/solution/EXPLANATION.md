# Solution: Optimistic Update Rollback

## The Bug

The `toggleTodo` function applies an optimistic update (flipping `completed`) immediately for a responsive UI, but when the server returns `{ success: false }`, it only sets an error message without reverting the state:

```ts
if (!result.success) {
  state = { ...state, error: `Failed to toggle todo ${id}` };
  // todos still in the optimistically-toggled state!
}
```

The UI now shows the todo as completed even though the server never persisted the change.

## The Fix

Save a snapshot of the todos before the optimistic update. On server failure, restore the snapshot:

```ts
const previousTodos = state.todos; // snapshot

// ... optimistic update ...

if (!result.success) {
  state = { ...state, todos: previousTodos, error: `Failed to toggle todo ${id}` };
  notify();
}
```

## Key Takeaway

Optimistic updates make UIs feel instant, but they create a contract: if the server rejects the change, the client must revert to the previous state. Always save a snapshot before applying optimistic changes. This pattern is used in TanStack Query (`onMutate` returns a context for rollback), React's `useOptimistic`, and Redux Toolkit's optimistic update utilities.

## Further Reading

- [TanStack Query Optimistic Updates](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates)
- [React useOptimistic](https://react.dev/reference/react/useOptimistic)

## Interview Context

"How do you handle optimistic updates when the server fails?" is a favorite interview question. The answer is: save a snapshot, apply the optimistic change, send the request, and rollback on failure. Mention that you'd also typically show an error toast or undo prompt to the user.
