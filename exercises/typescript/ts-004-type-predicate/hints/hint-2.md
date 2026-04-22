# Hint 2 (Medium)

TypeScript has a special return type syntax called a "type predicate":

```ts
function isCat(animal: Animal): animal is Cat {
  return animal.kind === "cat";
}
```

The `animal is Cat` return type tells TypeScript: "if this function returns true, then the `animal` parameter is of type `Cat`." This enables `.filter(isCat)` to produce `Cat[]` instead of `Animal[]`.

Apply this pattern to all the type guard functions. For `isNonNullable`, you'll want to make it generic using `NonNullable<T>`.
