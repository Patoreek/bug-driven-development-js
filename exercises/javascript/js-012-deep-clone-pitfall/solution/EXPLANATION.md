# Explanation: Shallow Clone Surprise

## Why the Bug Happens

JavaScript objects are **reference types**. When you use the spread operator (`{...obj}`) or `Object.assign()`, only the top-level properties are copied. Nested objects and arrays are not cloned -- they're still **references** pointing to the same objects in memory.

```typescript
const original = { name: "App", database: { host: "localhost", port: 5432 } };
const clone = { ...original };

// Top-level: separate copies
clone.name = "NewApp";
console.log(original.name); // "App" (OK, not affected)

// Nested: shared references!
clone.database.port = 3306;
console.log(original.database.port); // 3306 (BUG! Original was mutated)
```

This happens because `clone.database` and `original.database` point to the **same object** in memory. The spread only copies the reference, not the referenced object.

## The Fix

### cloneConfig: Use `structuredClone()`

```typescript
// Before (buggy)
return { ...config };

// After (fixed)
return structuredClone(config);
```

`structuredClone()` performs a true deep clone. All nested objects and arrays are recursively copied.

### updateNestedSetting: Deep clone before mutating

```typescript
// Before (buggy) -- mutates the original's nested objects
const updated = { ...config };
// ... then directly mutates nested properties

// After (fixed) -- deep clone first, then safely mutate the clone
const updated = structuredClone(config);
// ... now mutations only affect the clone
```

### mergeConfigs: Don't mutate the base

```typescript
// Before (buggy) -- Object.assign mutates its first argument
return Object.assign(base, overrides);

// After (fixed) -- clone the base first
const merged = structuredClone(base);
// ... then apply overrides to the clone
```

## Common Variations

1. **JSON.parse(JSON.stringify(obj))**: The old-school deep clone. Works for plain data but fails on `Date`, `Map`, `Set`, `undefined`, functions, and circular references.
2. **Lodash `_.cloneDeep()`**: The library solution, handles most edge cases.
3. **Recursive manual clone**: Writing your own deep clone function. Error-prone but educational.
4. **Immer**: A library that lets you write "mutating" code that actually produces immutable updates.

## When Shallow Clone Is Fine

Shallow clone is perfectly fine when:
- The object has no nested objects/arrays
- You only modify top-level properties
- You intentionally want to share nested references (rare)

## Interview Context

Interviewers test this concept by:
- Asking you to explain the difference between shallow and deep copy
- Giving you code that uses spread/assign and asking what happens when nested properties are modified
- Asking you to list different ways to deep clone an object and their tradeoffs
- Testing your knowledge of `structuredClone` as the modern solution

## References

- [MDN: structuredClone()](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone)
- [MDN: Spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
- [MDN: Object.assign()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
