# Solution: Unsafe Any Cast

## The Bug

The original code casts `unknown` input to `any` using `as any`, completely bypassing TypeScript's type system at the API boundary:

```ts
// BUG: `as any` removes all type safety
const response = raw as any;
return {
  data: {
    id: response.data.id,      // crashes if raw is null
    name: response.data.name,  // undefined if field missing
    role: response.data.role,  // "superuser" passes through unchecked
  },
  // ...
};
```

The `any` type is TypeScript's escape hatch -- it disables type checking entirely. While it makes things compile, it defers errors to runtime where they manifest as cryptic crashes like "Cannot read properties of undefined."

## The Fix

Replace `as any` with proper runtime validation that narrows `unknown` step by step:

```ts
// BEFORE
const response = raw as any;
return { data: { id: response.data.id } };

// AFTER
if (!isRecord(raw)) throw new Error("Expected response object");
if (!isRecord(raw.data)) throw new Error("Expected data object");
if (typeof raw.data.id !== "number") throw new Error("Expected id to be a number");
```

The key pattern is a helper type guard:

```ts
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
```

This lets you safely access properties after the check, with TypeScript understanding the narrowed type.

## Why This Matters

- **`any` vs `unknown`:** Both can hold any value, but `unknown` forces you to narrow before use. `any` silently disables checks.
- **API boundaries are the most critical place for validation** -- you have no control over what shape external data arrives in.
- **Fail fast, fail clearly:** Throwing an error with "Expected id to be a number" is infinitely better than a crash saying "Cannot read property 'toFixed' of undefined" three layers deep.

## Common Variations

- Using `as Type` (type assertion) instead of `as any` -- equally unsafe, just hides the `any`
- JSON.parse returning `any` -- should be treated as `unknown` and validated
- Third-party API responses typed with handwritten interfaces but never validated at runtime

## Interview Context

This concept frequently appears in interviews as: "What's the difference between `any` and `unknown`?" The key answer is that `unknown` is type-safe -- you must narrow it before use. Demonstrating that you validate data at boundaries (API responses, user input, JSON parsing) shows production-level TypeScript thinking.

## Further Reading

- [TypeScript Handbook: `unknown`](https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown)
- [TypeScript Handbook: Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
