# Generic Constraints

**ID:** `ts-003-generic-constraints`  
**Difficulty:** ★★★☆☆  
**Estimated Time:** 20 minutes  
**Tags:** `typescript`, `generics`, `constraints`, `extends`, `keyof`  
**Prerequisites:** `ts-001-unsafe-any-cast`

---

## The Scenario

Your team built a generic repository class that stores and retrieves entities. It works with Users, Products, and other models that all have an `id` field. However, the generics have no constraints, so the code resorts to `as any` casts internally to access `item.id`. A junior developer recently tried to use the repository with a type that has no `id` field and got a confusing runtime error. The utility functions `pluck`, `merge`, and `getProperty` have the same problem -- they accept any type parameters and return `unknown`.

## The Bug

The generic type parameters `T` and `K` are unconstrained:

- `Repository<T>` allows any `T`, but internally casts to `any` to access `item.id`
- `pluck<T, K>` allows `K` to be any type, not just a key of `T`, and returns `unknown[]`
- `merge<T, U>` doesn't require `T` and `U` to be objects
- `getProperty<T, K>` doesn't constrain `K` to be a key of `T` and returns `unknown`

## Your Task

1. Add appropriate generic constraints using `extends`
2. Remove all `as any` casts
3. Use `keyof` to constrain key parameters
4. Make return types precise instead of `unknown`
5. Ensure all tests pass
6. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/repository.ts` | Generic repository and utility functions with unconstrained type parameters |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Generic Constraints](https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints) -- using `extends` to limit type parameters
- [keyof operator](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html) -- getting a union of an object's keys
- [Indexed Access Types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html) -- `T[K]` for type-safe property access
