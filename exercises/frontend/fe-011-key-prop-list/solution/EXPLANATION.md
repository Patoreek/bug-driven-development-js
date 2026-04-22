# Solution: Key Prop Chaos

## The Problem

The original code used the array index as the `key` prop when rendering list items:

```tsx
{todos.map((todo, index) => (
  <li key={index} data-testid={`todo-${todo.id}`}>
```

When React re-renders a list, it uses `key` to match old elements with new ones. With index-based keys:

- Position 0 always maps to key `0`
- Position 1 always maps to key `1`
- etc.

So when you remove the first item, the second item (now at index 0) inherits the DOM state (checkbox checked/unchecked) of the previous first item. React thinks it's the "same" component because the key matches.

## The Fix

Use the unique `id` from each todo object as the key:

```tsx
{todos.map((todo) => (
  <li key={todo.id} data-testid={`todo-${todo.id}`}>
```

Now React correctly tracks each item by its stable identity. When the first item is removed, the remaining items keep their keys (and therefore their DOM state).

## Key Takeaway

Use array index as key **only** when:
1. The list is static (never reordered, filtered, or items removed)
2. Items have no state (no inputs, no checkboxes, no animations)

In all other cases, use a stable unique identifier (database ID, UUID, etc.).
