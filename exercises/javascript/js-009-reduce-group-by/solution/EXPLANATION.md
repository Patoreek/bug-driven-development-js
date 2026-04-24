# Explanation: Reduce groupBy Gone Wrong

## Why the Bug Happens

The core issue is in how the accumulator is updated inside `reduce()`. The buggy code uses:

```typescript
acc[key] = [item]; // Overwrites with a new single-element array every time
```

Each time a new item has the same key as a previous one, the previous array is thrown away and replaced with a new array containing only the current item. Only the **last** item for each key survives.

For `countBy`, the same pattern applies:

```typescript
acc[key] = 1; // Always resets to 1 instead of incrementing
```

## The Fix

### groupBy / groupByProperty

Check if the key already exists. If not, initialize an empty array. Then push the item:

```typescript
// Before (buggy)
acc[key] = [item];

// After (fixed)
if (!acc[key]) {
  acc[key] = [];
}
acc[key].push(item);
```

An alternative one-liner approach:

```typescript
acc[key] = [...(acc[key] || []), item];
```

However, the `push` approach is more performant since it doesn't create a new array on every iteration.

### countBy

```typescript
// Before (buggy)
acc[key] = 1;

// After (fixed)
acc[key] = (acc[key] || 0) + 1;
```

## Modern Alternative: Object.groupBy()

As of ES2024, JavaScript has a native `Object.groupBy()` method:

```typescript
const grouped = Object.groupBy(orders, (order) => order.status);
```

This handles the accumulator logic for you and is the preferred approach in modern codebases. However, understanding the `reduce` pattern is still important since `Object.groupBy` is relatively new and you'll encounter the reduce pattern in existing code.

## Common Variations

1. **Using `acc[key] = acc[key].push(item)`** -- `push` returns the new length (a number), not the array, so this replaces the array with a number
2. **Forgetting to initialize**: `acc[key].push(item)` without checking if `acc[key]` exists -- throws `TypeError: Cannot read properties of undefined`
3. **Using spread each time**: `acc[key] = [...(acc[key] || []), item]` -- works but creates a new array on every iteration (O(n^2) total allocations for a single group)

## Interview Context

This pattern is extremely common in interviews. You may be asked to:
- Implement `groupBy` from scratch (Lodash-style)
- Use `reduce` to build complex data structures
- Explain the performance implications of different accumulator patterns

The key insight interviewers look for: understanding that `reduce` requires careful accumulator management, and that the accumulator must be properly initialized and mutated (or replaced) on each iteration.

## References

- [MDN: Array.prototype.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
- [MDN: Object.groupBy()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/groupBy)
