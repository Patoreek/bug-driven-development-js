# Unsafe Any Cast

**ID:** `ts-001-unsafe-any-cast`  
**Difficulty:** ★★☆☆☆  
**Estimated Time:** 15 minutes  
**Tags:** `typescript`, `any`, `unknown`, `type-safety`, `runtime-validation`  
**Prerequisites:** None

---

## The Scenario

You joined a team that consumes a third-party REST API. The previous developer used `as any` everywhere to quickly get things compiling. In staging, the app started crashing when the API returned unexpected shapes -- missing fields, wrong types, and invalid enum values all slip through silently because TypeScript's type safety was bypassed at the boundary.

Your tech lead has asked you to replace the `as any` casts with proper runtime validation so that bad data is caught early with clear error messages instead of causing mysterious `undefined` crashes deep in the call stack.

## The Bug

The parsing functions cast `unknown` input to `any` and then access properties without any validation. This means:

- `null` or `undefined` input causes "Cannot read properties of null" crashes
- Missing fields silently produce `undefined` values
- Invalid enum values (like `role: "superuser"`) pass through unchecked
- Wrong types (like `id: "abc"` instead of a number) are never caught

## Your Task

1. Replace all `as any` casts in `src/parseApiResponse.ts` with proper runtime type checking
2. Throw descriptive errors when input doesn't match the expected shape
3. Validate types, required fields, and enum values
4. Ensure all tests pass
5. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/parseApiResponse.ts` | API response parsing functions that use unsafe `any` casts |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [The `unknown` type](https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown) -- top type that requires narrowing
- [Type narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) -- how TypeScript narrows types with checks
- [Type guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates) -- user-defined type predicates
