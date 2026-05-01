# Hint 3 - Implementation

Replace the `..` handling with:

```typescript
if (part === "..") {
  stack.pop(); // Go to parent directory
}
```

`Array.pop()` on an empty array returns `undefined` and does nothing, so you don't need to check if the stack is empty -- going above root is automatically safe.

The full logic for each token:
- Empty string or `"."` -> skip
- `".."` -> pop last directory from stack
- Anything else -> push onto stack
