# Type Predicate Filters

**ID:** `ts-004-type-predicate`  
**Difficulty:** ★★★☆☆  
**Estimated Time:** 20 minutes  
**Tags:** `typescript`, `type-predicates`, `type-guards`, `narrowing`, `filter`  
**Prerequisites:** `ts-001-unsafe-any-cast`

---

## The Scenario

Your team's codebase has a set of utility functions for filtering arrays of mixed types -- animals by species, nullable values, and API results by success/error status. The runtime behavior is correct, but every call site requires an `as Type` cast after filtering because TypeScript doesn't know the filter narrowed the type. A code review flagged over 30 unnecessary type assertions across the codebase, all stemming from these filter functions.

## The Bug

The type guard functions (`isCat`, `isDog`, `isSuccess`, etc.) return `boolean` instead of type predicates. While the runtime logic is correct, TypeScript sees `animals.filter(isCat)` as returning `Animal[]` instead of `Cat[]`, because a `boolean` return type doesn't communicate that the function narrows the type. Every caller has to add `as Cat[]` to work around this.

## Your Task

1. Change the return types of all type guard functions to use type predicates (`animal is Cat`, etc.)
2. Remove the unnecessary `as Type` casts that become redundant
3. Make `isNonNullable` generic so it works with any type
4. Ensure all tests pass
5. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/filters.ts` | Type guard and filtering functions returning `boolean` instead of type predicates |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Type Predicates](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates) -- `value is Type` return type syntax
- [Array.filter with type guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) -- how filter narrows array types
- [NonNullable utility type](https://www.typescriptlang.org/docs/handbook/utility-types.html#nonnullabletype) -- removes null and undefined
