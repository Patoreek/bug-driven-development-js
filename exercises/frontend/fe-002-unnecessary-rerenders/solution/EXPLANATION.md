# Solution: Unnecessary Re-renders

## The Bug

Three issues cause unnecessary re-renders:

1. **`TodoItem` is not memoized** — it re-renders whenever the parent re-renders, even if its props haven't changed.

2. **`toggleTodo` is recreated every render** — a new function reference is created each time `TodoApp` renders, so even a `memo`-wrapped `TodoItem` would see different `onToggle` props.

3. **`filteredTodos` is recomputed every render** — `Array.filter` creates a new array reference every time, even when the inputs (`todos` and `search`) haven't changed.

## The Fix

1. **Wrap `TodoItem` with `memo()`** so it only re-renders when its props change:
   ```tsx
   const TodoItem = memo(function TodoItem({ todo, onToggle }) { ... });
   ```

2. **Wrap `toggleTodo` with `useCallback`** so the same function reference is used across renders:
   ```tsx
   const toggleTodo = useCallback((id: number) => {
     setTodos((prev) => prev.map((t) => ...));
   }, []);
   ```

3. **Wrap filtered todos with `useMemo`** so the array is only recomputed when `todos` or `search` changes:
   ```tsx
   const filteredTodos = useMemo(
     () => todos.filter((t) => t.text.toLowerCase().includes(search.toLowerCase())),
     [todos, search]
   );
   ```

## Key Takeaway

`React.memo` only works when the props are referentially stable. If you pass inline objects or functions, the memo is useless. Pair `memo` with `useCallback` for functions and `useMemo` for computed values.
