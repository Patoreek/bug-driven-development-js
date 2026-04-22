For each action, follow this pattern:

```ts
case "ADD_ITEM": {
  const newItems = existing
    ? state.items.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    : [...state.items, { ...action.payload, quantity: 1 }];
  return { ...state, items: newItems, total: calculateTotal(newItems) };
}

case "REMOVE_ITEM": {
  const newItems = state.items.filter(item => item.id !== id);
  return { ...state, items: newItems, total: calculateTotal(newItems) };
}
```

Every return must create new objects for `state`, `items` array, and any changed item.
