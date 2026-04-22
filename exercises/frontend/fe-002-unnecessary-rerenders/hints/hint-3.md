# Hint 3 (Strong)

Apply three changes:
1. Wrap `TodoItem` with `memo()`: `const TodoItem = memo(function TodoItem(...) { ... })`
2. Wrap `toggleTodo` with `useCallback(..., [])` (it already uses functional setState so it needs no dependencies)
3. Wrap the filtered todos computation with `useMemo(() => todos.filter(...), [todos, search])`
