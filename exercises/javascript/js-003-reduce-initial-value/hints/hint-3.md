# Hint 3

Add the appropriate initial value as the second argument to each `reduce` call:

- For `calculateTotal`: use `0` — the identity value for addition
- For `flattenArrays`: use `[]` (empty array) — the identity value for concatenation
- For `groupBy`: use `{}` (empty object) — the starting point for the groups

```ts
items.reduce((total, item) => total + item.price * item.quantity, 0);
```
