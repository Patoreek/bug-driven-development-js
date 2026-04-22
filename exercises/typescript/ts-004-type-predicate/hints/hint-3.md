# Hint 3 (Strong)

Change each guard to return a type predicate:

```ts
export function isCat(animal: Animal): animal is Cat { ... }
export function isDog(animal: Animal): animal is Dog { ... }
export function isFish(animal: Animal): animal is Fish { ... }
export function isSuccess(result: Result): result is SuccessResult { ... }
```

For `isNonNullable`, make it generic:

```ts
export function isNonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}
```

Once the predicates are in place, remove all the `as Cat[]`, `as Dog[]`, `as SuccessResult` casts -- TypeScript will infer the correct types automatically.
