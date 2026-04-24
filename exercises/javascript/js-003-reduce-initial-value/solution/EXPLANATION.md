# Explanation: The Missing Reduce Initial Value

## Why the Bug Happens

`Array.prototype.reduce()` has an optional second argument: the **initial value** of the accumulator.

```ts
array.reduce(callback, initialValue);
```

When `initialValue` is omitted:
1. The **first element** of the array becomes the initial accumulator value
2. Iteration starts from the **second element**
3. If the array is **empty**, a `TypeError` is thrown

### Problem 1: Empty arrays throw

```ts
[].reduce((sum, item) => sum + item.price);
// TypeError: Reduce of empty array with no initial value
```

### Problem 2: Wrong accumulator type

When reducing an array of objects to a number:

```ts
[{price: 10}, {price: 20}].reduce((total, item) => total + item.price);
```

The first call has `total = {price: 10}` (an object, not `0`), so `total + item.price` produces `"[object Object]20"` — a string concatenation.

### Problem 3: groupBy with one item

With a single item, `reduce` returns that item directly without ever calling the callback, so you get the raw item instead of a grouped object.

## The Fix

Always provide an initial value that matches the expected accumulator type.

### Before (buggy):
```ts
items.reduce((total, item) => total + item.price * item.quantity);
arrays.reduce((flat, arr) => flat.concat(arr));
items.reduce((groups, item) => { ... return groups; });
```

### After (fixed):
```ts
items.reduce((total, item) => total + item.price * item.quantity, 0);
arrays.reduce((flat, arr) => flat.concat(arr), [] as T[]);
items.reduce((groups, item) => { ... return groups; }, {} as Record<string, T[]>);
```

## Common Variations

- **Summing object properties**: Forgetting the initial `0` when reducing `[{val: 1}, {val: 2}]`
- **Building strings**: `reduce` without `""` causes the first element to become the base
- **Counting occurrences**: Forgetting `{}` as initial value for a frequency map

## Rule of Thumb

**Always provide an initial value to `reduce`**. The only safe exception is when you're reducing an array of primitives to the same type AND you can guarantee the array is never empty.

## Interview Context

Interviewers test this concept because:
1. It reveals understanding of how `reduce` actually works internally
2. It tests defensive programming — handling edge cases like empty arrays
3. It connects to TypeScript — the initial value determines the accumulator's type
4. Follow-up: "What does `reduce` do with one element and no initial value?" (Returns the element without calling the callback)

## References

- [MDN: Array.prototype.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
