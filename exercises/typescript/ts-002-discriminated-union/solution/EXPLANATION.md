# Solution: Discriminated Union Notifications

## The Bug

The original code defines a single interface with `type: string` and all fields optional:

```ts
interface Notification {
  type: string;        // too broad — any string is valid
  title: string;
  message?: string;    // optional on all types
  href?: string;       // optional on all types
  progress?: number;   // optional on all types
  errorCode?: number;  // optional on all types
}
```

This is problematic because:
1. You can create `{ type: "progress", title: "Upload" }` without `progress` or `total`
2. You can access `notification.errorCode` on an info notification
3. Adding a new type to the union doesn't cause a compile error anywhere

## The Fix

Replace with a discriminated union -- each variant has a literal `type` and only its own fields:

```ts
// BEFORE
interface Notification {
  type: string;
  title: string;
  message?: string;
  href?: string;
  progress?: number;
  total?: number;
  errorCode?: number;
}

// AFTER
type Notification =
  | { type: "info"; title: string; message: string }
  | { type: "error"; title: string; message: string; errorCode: number }
  | { type: "progress"; title: string; progress: number; total: number }
  | { type: "link"; title: string; href: string };
```

Add an exhaustive check with the `never` type:

```ts
function assertNever(value: never): never {
  throw new Error(`Unhandled type: ${(value as any).type}`);
}

switch (notification.type) {
  case "info": // TypeScript knows message exists here
  case "error": // TypeScript knows errorCode exists here
  // ...
  default: return assertNever(notification); // compile error if a case is missing
}
```

## Why This Matters

Discriminated unions are TypeScript's most powerful pattern for modeling data that comes in several shapes. The `type` (or `kind`) literal field acts as a tag that TypeScript can switch on to narrow the type automatically.

The `never` trick in the `default` case ensures that if someone adds `{ type: "warning"; ... }` to the union, the code won't compile until every `switch` statement handles the new variant.

## Common Variations

- Using `kind` or `status` as the discriminant field instead of `type`
- Redux actions -- `{ type: "INCREMENT" }` vs `{ type: "SET_VALUE"; value: number }`
- API responses -- `{ status: "success"; data: T }` vs `{ status: "error"; error: string }`

## Interview Context

Discriminated unions are a frequent TypeScript interview topic. You may be asked to model a payment system (credit card vs bank transfer vs crypto, each with different fields), or to explain how exhaustive checking prevents bugs when extending a system. The `assertNever` pattern is a strong signal of advanced TypeScript knowledge.

## Further Reading

- [Discriminated Unions](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions)
- [Exhaustiveness Checking](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking)
