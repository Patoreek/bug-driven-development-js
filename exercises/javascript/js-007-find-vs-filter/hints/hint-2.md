# Hint 2

JavaScript has purpose-built array methods for these patterns:

- **`.find()`** — returns the first matching element, or `undefined` if none found (short-circuits)
- **`.some()`** — returns `true` if any element matches the predicate (short-circuits)

Both stop iterating as soon as they find a match, unlike `.filter()` which always processes the entire array.

The `?? null` at the end of the find functions converts `undefined` to `null`, which is wrong — the tests expect `undefined`.
