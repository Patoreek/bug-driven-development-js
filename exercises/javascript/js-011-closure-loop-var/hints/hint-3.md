# Hint 3 -- Strong

Replace every `var` in the `for` loop declarations with `let`:

```typescript
// Before
for (var i = 0; i < n; i++)

// After
for (let i = 0; i < n; i++)
```

`let` is block-scoped, so each loop iteration creates a fresh variable that the closure captures independently.
