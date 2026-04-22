# Solution: Type Predicate Filters

## The Bug

The type guard functions return `boolean`, which doesn't communicate to TypeScript that they narrow the type:

```ts
// BUG: Returns boolean — TypeScript learns nothing about `animal`'s type
export function isCat(animal: Animal): boolean {
  return animal.kind === "cat";
}

// Result: animals.filter(isCat) returns Animal[], not Cat[]
export function getCats(animals: Animal[]): Cat[] {
  return animals.filter(isCat) as Cat[];  // forced to cast
}
```

## The Fix

Replace `boolean` return types with type predicates using the `value is Type` syntax:

```ts
// BEFORE
export function isCat(animal: Animal): boolean { ... }

// AFTER
export function isCat(animal: Animal): animal is Cat { ... }
```

Now TypeScript knows that after `isCat(animal)` returns `true`, `animal` is a `Cat`:

```ts
// No cast needed — filter(isCat) returns Cat[]
export function getCats(animals: Animal[]): Cat[] {
  return animals.filter(isCat);
}
```

For `isNonNullable`, making it generic with `NonNullable<T>` lets it work with any type:

```ts
// BEFORE
export function isNonNullable(value: unknown): boolean { ... }

// AFTER
export function isNonNullable<T>(value: T): value is NonNullable<T> { ... }
```

## Why This Matters

Type predicates are the bridge between runtime checks and compile-time types. Without them, every `if (isX(value))` or `.filter(isX)` leaves TypeScript unable to narrow the type, forcing `as` casts everywhere. Those casts are:

1. **Verbose** -- clutter at every call site
2. **Fragile** -- if the runtime check changes, the cast silently becomes a lie
3. **Unsafe** -- `as` casts are unchecked, so they mask real type errors

## Common Variations

- `Array.prototype.filter` with type guards is the most common use case
- Parsing functions: `function isValidEmail(input: string): input is Email`
- DOM checks: `function isInputElement(el: Element): el is HTMLInputElement`
- Null checks: filtering out nullish values from arrays

## Interview Context

Type predicates are a classic TypeScript interview question, often asked as: "How would you type a function that filters an array of mixed types?" or "What's a user-defined type guard?" The key insight is that `boolean` alone doesn't carry type information -- you need the `is` keyword.

## Further Reading

- [Using Type Predicates](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)
- [NonNullable Utility Type](https://www.typescriptlang.org/docs/handbook/utility-types.html#nonnullabletype)
