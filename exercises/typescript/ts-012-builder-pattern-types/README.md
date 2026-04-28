# Builder Pattern Types: Type-Safe Progressive Construction

**ID:** `ts-012-builder-pattern-types`
**Difficulty:** ★★★★★
**Estimated Time:** 30 minutes
**Tags:** `typescript`, `builder-pattern`, `generics`, `type-state`, `conditional-types`
**Prerequisites:** `ts-003-generic-constraints`, `ts-008-conditional-types`

---

## The Scenario

Your team is building a database connection library with a fluent builder API. The builder lets developers chain `.host()`, `.port()`, `.database()`, and `.ssl()` calls to configure a connection. The goal is to make `.build()` only callable when all required fields (host, port, database) have been set -- catching missing configuration at compile time rather than runtime. However, the type-state tracking is broken: the builder's generic type parameter never changes as methods are called, so TypeScript can't tell which fields have been configured.

## The Bug

The builder's type system has several issues:

1. **Builder methods don't update the generic state**: Each method like `.host()` returns `QueryBuilder<State>` with the same `State` it received, instead of adding the field to the state type. The type never progresses.

2. **`HasAllRequired` conditional is inverted**: When `RequiredKeys extends keyof State` (meaning all required keys are in the state), it returns `false` instead of `true`.

3. **`build()` has no type-level guard**: The method is callable on any `QueryBuilder` regardless of state, so `createQueryBuilder().build()` compiles even though no fields are set.

4. **`createQueryBuilder` doesn't initialize with an explicit empty state**: The factory returns a loosely typed builder.

## Your Task

1. Examine `src/builderPatternTypes.ts`
2. Fix each builder method to return `QueryBuilder<State & { fieldName: true }>`, progressively adding fields to the state type
3. Fix `HasAllRequired` to return `true` when all required keys are present (not `false`)
4. Fix `build()` to use a `this` parameter type that restricts calling it to states where `HasAllRequired` is `true`
5. Fix `createQueryBuilder` to return `QueryBuilder<{}>` explicitly
6. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/builderPatternTypes.ts` | Builder with broken type-state tracking and inverted completeness check |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Generic Classes](https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-classes) -- type parameters on classes
- [Intersection Types](https://www.typescriptlang.org/docs/handbook/2/objects.html#intersection-types) -- combining types with &
- [this Parameters](https://www.typescriptlang.org/docs/handbook/2/functions.html#this-parameters) -- restricting method calls based on this type
- [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html) -- type-level branching
