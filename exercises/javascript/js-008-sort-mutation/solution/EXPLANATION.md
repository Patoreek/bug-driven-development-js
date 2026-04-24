# Explanation: The Sort Mutation Surprise

## Why the Bug Happens

JavaScript's `Array.prototype.sort()` is one of several array methods that **mutate the original array** in place. It also returns a reference to the same (now sorted) array — which tricks many developers into thinking they got a new sorted copy.

```ts
const arr = [3, 1, 2];
const sorted = arr.sort((a, b) => a - b);

console.log(sorted); // [1, 2, 3]
console.log(arr);    // [1, 2, 3]  -- SAME array, mutated!
console.log(arr === sorted); // true -- same reference
```

### In `getTopScores`:
```ts
const sorted = scores.sort((a, b) => b - a); // Mutates scores!
```
After calling this, the caller's `scores` array is permanently reordered.

### In `getProductViews`:
```ts
const byPrice = products.sort(...); // Mutates products!
return { featured: products, byPrice }; // Both are the same sorted array
```
Both `featured` and `byPrice` point to the same sorted array.

## The Fix

Create a copy before sorting. The simplest approach is the spread operator:

### Before (buggy):
```ts
const sorted = scores.sort((a, b) => b - a);
```

### After (fixed):
```ts
const sorted = [...scores].sort((a, b) => b - a);
```

### Alternative: `.toSorted()` (ES2023)

```ts
const sorted = scores.toSorted((a, b) => b - a);
```

`.toSorted()` is the non-mutating counterpart to `.sort()`. It returns a new sorted array without modifying the original. Other non-mutating alternatives added in ES2023:

| Mutating | Non-mutating |
|----------|-------------|
| `.sort()` | `.toSorted()` |
| `.reverse()` | `.toReversed()` |
| `.splice()` | `.toSpliced()` |

### For `getProductViews`:

Both views need separate copies:
```ts
const byPrice = [...products].sort((a, b) => a.price - b.price);
return { featured: [...products], byPrice };
```

## Common Variations

- **`.reverse()` mutation**: Same issue — mutates in place
- **`.splice()` mutation**: Modifies the original array by removing/adding elements
- **Object spreading for shallow copies**: `[...arr]` is a shallow copy — nested objects still share references
- **React state**: Mutating arrays in state and calling `setState` — React may not re-render because the reference hasn't changed

## Interview Context

This question tests:
1. Knowledge of which array methods mutate vs. return new arrays
2. Understanding of reference vs. value in JavaScript
3. Defensive programming — always copying before mutating
4. Awareness of ES2023 non-mutating alternatives
5. Common pitfall: `const sorted = arr.sort()` looks like it creates a copy but doesn't

### Mutating array methods to remember:
`sort`, `reverse`, `splice`, `push`, `pop`, `shift`, `unshift`, `fill`, `copyWithin`

### Non-mutating array methods:
`map`, `filter`, `reduce`, `slice`, `concat`, `flat`, `flatMap`, `toSorted`, `toReversed`, `toSpliced`

## References

- [MDN: Array.prototype.sort()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
- [MDN: Array.prototype.toSorted()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted)
