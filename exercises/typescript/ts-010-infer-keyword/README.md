# The infer Keyword: Type-Level Pattern Matching

**ID:** `ts-010-infer-keyword`
**Difficulty:** ★★★★☆
**Estimated Time:** 25 minutes
**Tags:** `typescript`, `infer`, `conditional-types`, `type-extraction`, `generics`
**Prerequisites:** `ts-008-conditional-types`

---

## The Scenario

You are maintaining a shared utility types package used across your company's microservices. The package provides types like `GetReturnType`, `UnpackPromise`, `FirstElement`, and others that extract type information using `infer`. After a recent refactor, several of these utility types are returning wrong results -- `GetReturnType` returns parameter types instead of the return type, `FirstElement` extracts the tail instead of the head, and `UnpackPromise` only unwraps one level of nesting.

## The Bug

Six `infer`-based utility types have incorrect patterns:

1. **`GetReturnType<T>`** places `infer R` in the parameter position instead of the return position, extracting parameter types instead of the return type.

2. **`UnpackPromise<T>`** unwraps one level of `Promise` but doesn't recurse, so `Promise<Promise<string>>` returns `Promise<string>` instead of `string`.

3. **`FirstElement<T>`** uses `[any, ...infer First]`, which captures the rest of the tuple after the first element instead of the first element itself.

4. **`ConstructorParams<T>`** places `infer P` in the instance/return position of the constructor signature instead of the parameter position.

5. **`FlattenArray<T>`** unwraps one level of `Array<>` but doesn't recurse, so `number[][]` returns `number[]` instead of `number`.

6. **`ExtractEventData<T>`** matches the `Event` structure but uses `unknown` instead of `infer` for the data type, so it returns the whole event instead of just the data.

## Your Task

1. Examine `src/inferKeyword.ts`
2. Fix `GetReturnType` to place `infer R` in the return position
3. Fix `UnpackPromise` to recursively unwrap nested Promises
4. Fix `FirstElement` to infer the first element, not the rest
5. Fix `ConstructorParams` to infer from the parameter position
6. Fix `FlattenArray` to recursively flatten nested arrays
7. Fix `ExtractEventData` to use `infer` to capture the data type
8. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/inferKeyword.ts` | Type utilities with incorrect `infer` positions and missing recursion |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Inferring Within Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types) -- the infer keyword
- [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html) -- extends with infer
- [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html) -- ReturnType, ConstructorParameters, Awaited
