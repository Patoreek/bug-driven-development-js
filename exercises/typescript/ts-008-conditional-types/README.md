# Conditional Types: Distributive vs Non-Distributive

**ID:** `ts-008-conditional-types`  
**Difficulty:** ★★★★☆  
**Estimated Time:** 25 minutes  
**Tags:** `typescript`, `conditional-types`, `distributive`, `generics`, `utility-types`  
**Prerequisites:** `ts-003-generic-constraints`

---

## The Scenario

Your team is building a type-safe API client library. You've written several utility types that use conditional types to filter, extract, and transform union types. However, the types are behaving unexpectedly — `ExtractStrings<string | number>` evaluates to `string | number` instead of just `string`, and `IsNever<never>` returns `never` instead of `true`. You suspect the issue is related to how TypeScript distributes conditional types over unions.

## The Bug

The utility types have multiple conditional type errors:

1. **`ExtractStrings<T>`** wraps `T` in a tuple `[T]` before checking, preventing distributive behavior. The conditional type doesn't distribute over the union, so `ExtractStrings<string | number>` checks `[string | number] extends [string]` which is false, returning `never` for the entire union.

2. **`NonNullableDeep<T>`** also wraps `T` preventing distribution — it can't strip `null | undefined` from union members.

3. **`IsNever<T>`** uses a naked type parameter, so it distributes over `never` (which is an empty union), returning `never` instead of `true`. It needs to be non-distributive.

4. **`TypeName<T>`** maps types to string literals but doesn't distribute, so `TypeName<string | number>` returns a single result instead of a union of results.

## Your Task

1. Examine `src/conditionalTypes.ts`
2. Fix `ExtractStrings` to use distributive conditional types (naked type parameter)
3. Fix `NonNullableDeep` to properly distribute over union members
4. Fix `IsNever` to use non-distributive form (wrapped in tuple) to handle `never` correctly
5. Fix `TypeName` to properly distribute and map each union member
6. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/conditionalTypes.ts` | Utility types with incorrect distributive/non-distributive patterns |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Distributive Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types) -- when and how distribution happens
- [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html) -- extends keyword in types
- [never Type](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-never-type) -- empty union behavior
