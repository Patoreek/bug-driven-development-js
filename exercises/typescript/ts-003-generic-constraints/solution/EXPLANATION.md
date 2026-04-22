# Solution: Generic Constraints

## The Bug

The generic type parameters are completely unconstrained, forcing the code to use `as any` casts:

```ts
// BUG: T could be anything — even a number or string
export class Repository<T> {
  findById(id: string): T | undefined {
    // Has to cast to `any` because T might not have `id`
    return this.items.find((item: any) => item.id === id);
  }
}

// BUG: K is unconstrained — could be any type, not just a key of T
export function pluck<T, K>(items: T[], key: K): unknown[] {
  return items.map((item: any) => item[key]);
}
```

## The Fix

Add constraints using the `extends` keyword:

```ts
// BEFORE
export class Repository<T> {
  findById(id: string) {
    return this.items.find((item: any) => item.id === id);
  }
}

// AFTER
interface HasId { id: string; }

export class Repository<T extends HasId> {
  findById(id: string) {
    return this.items.find((item) => item.id === id); // no cast needed
  }
}
```

```ts
// BEFORE
export function pluck<T, K>(items: T[], key: K): unknown[] { ... }

// AFTER
export function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] { ... }
```

```ts
// BEFORE
export function getProperty<T, K>(obj: T, key: K): unknown { ... }

// AFTER
export function getProperty<T extends object, K extends keyof T>(obj: T, key: K): T[K] { ... }
```

## Why This Matters

Generic constraints are the mechanism that makes generics actually useful. Without constraints, you can't access any properties on a generic type, which leads to `as any` casts that defeat the purpose of TypeScript.

Key patterns:
- **`T extends { id: string }`** -- T must have an `id` property
- **`K extends keyof T`** -- K must be a valid key of T
- **`T[K]`** -- the type of property K on type T (indexed access type)
- **`T extends object`** -- T must be an object, not a primitive

## Common Variations

- ORMs like Prisma use constrained generics for model-specific queries
- Lodash's `_.get(obj, key)` is the classic example of needing `keyof` constraints
- React's `useState<T>` constraining the state type

## Interview Context

Generic constraints come up frequently: "How would you type a function that picks a property from any object?" The answer involves `<T, K extends keyof T>` and the return type `T[K]`. Being able to explain the `extends` keyword in the context of generics (not class inheritance) demonstrates strong TypeScript understanding.

## Further Reading

- [Generic Constraints](https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints)
- [keyof Type Operator](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html)
- [Indexed Access Types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)
