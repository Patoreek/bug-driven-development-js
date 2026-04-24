# Explanation: find() vs filter()[0]

## Why the Bug Happens

### Semantic mismatch

`.filter()` is designed to return **all** matching elements. Using `.filter()[0]` to get the **first** match works, but it's wasteful and unclear:

```ts
// Iterates ALL 10,000 users, creates a full array, then takes [0]
users.filter((u) => u.email === email)[0];

// Stops at the first match — O(1) best case
users.find((u) => u.email === email);
```

### Wrong return value

`.filter()[0]` returns `undefined` when no match is found. But the code adds `?? null`, converting `undefined` to `null`. Callers expecting `undefined` (the standard "not found" return value in JavaScript) get `null` instead, which can cause subtle bugs in strict equality checks.

### Performance issue

`.filter()` always processes the **entire** array, building a new array of all matches. For existence checks, `.filter().length > 0` creates a potentially large array just to check its length. `.some()` returns `true` as soon as it finds the first match.

## The Fix

Use the semantically correct array methods:

### For single-item lookup: `.find()`

**Before:**
```ts
return users.filter((u) => u.email === email)[0] ?? null;
```

**After:**
```ts
return users.find((u) => u.email === email);
```

### For existence checks: `.some()`

**Before:**
```ts
return users.filter((u) => u.role === "admin").length > 0;
```

**After:**
```ts
return users.some((u) => u.role === "admin");
```

## Method Selection Guide

| Need | Method | Returns |
|------|--------|---------|
| First matching element | `.find()` | element or `undefined` |
| All matching elements | `.filter()` | array (possibly empty) |
| Does any element match? | `.some()` | `boolean` |
| Do all elements match? | `.every()` | `boolean` |
| Index of first match | `.findIndex()` | number (-1 if not found) |

## Common Variations

- **`.filter().length === 1`** to check for exactly one match (still valid use of `.filter()`)
- **`.filter()[0]` vs `.find()`** — functionally similar for the happy path, but `.find()` short-circuits
- **`.indexOf() !== -1`** vs **`.includes()`** or **`.some()`** — same idea, use the right tool

## Interview Context

This tests:
1. Knowledge of the full array method API (find, some, every, filter, includes)
2. Understanding of short-circuit evaluation and performance implications
3. Ability to choose the most semantically clear method
4. Awareness that `.find()` returns `undefined` (not `null`) when not found

## References

- [MDN: Array.prototype.find()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)
- [MDN: Array.prototype.some()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)
