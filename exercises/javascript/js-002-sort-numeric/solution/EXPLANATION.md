# Explanation: Lexicographic Sort Surprise

## Why the Bug Happens

JavaScript's `Array.prototype.sort()` without a comparison function converts every element to a string and sorts by UTF-16 code unit values. This is **lexicographic** (dictionary) ordering, not numeric ordering.

```js
[10, 9, 2, 21, 3].sort();
// Result: [10, 2, 21, 3, 9]
// Because: "10" < "2" < "21" < "3" < "9" in string comparison
```

The character `"1"` (code 49) comes before `"2"` (code 50), so `"10"` sorts before `"2"`.

For objects, `.sort()` without a comparator converts them to `"[object Object]"`, making all elements "equal" and producing implementation-dependent ordering.

## The Fix

### Numbers: provide a numeric comparison function

**Before:**
```ts
return [...numbers].sort();
```

**After:**
```ts
return [...numbers].sort((a, b) => a - b);
```

The comparison function should return:
- A negative number if `a` should come first
- A positive number if `b` should come first
- Zero if they're equal

### Products: compare by the numeric property

**Before:**
```ts
return [...products].sort((a, b) => {
  return String(a.price) > String(b.price) ? 1 : -1;
});
```

**After:**
```ts
return [...products].sort((a, b) => a.price - b.price);
```

### Dates: compare the ISO date strings

**Before:**
```ts
return [...events].sort();
```

**After:**
```ts
return [...events].sort((a, b) => a.date.localeCompare(b.date));
```

ISO date strings (`YYYY-MM-DD`) sort correctly with string comparison because the most significant parts come first.

## Common Variations

- **Sorting string IDs that contain numbers**: `["item-2", "item-10", "item-1"]` — needs natural sort
- **Sorting by multiple criteria**: price then name — requires a compound comparator
- **Descending sort**: `(a, b) => b - a` instead of `(a, b) => a - b`

## Interview Context

This is one of the most frequently asked JavaScript gotchas in interviews. Interviewers want to see:
1. You know `.sort()` defaults to lexicographic ordering
2. You can write a proper comparison function
3. You understand the return value contract (negative/zero/positive)
4. Bonus: you mention `.toSorted()` (ES2023) for non-mutating sort

## References

- [MDN: Array.prototype.sort()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
- [MDN: String.prototype.localeCompare()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare)
