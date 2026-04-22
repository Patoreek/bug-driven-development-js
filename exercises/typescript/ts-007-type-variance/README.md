# Type Variance

**ID:** `ts-007-type-variance`  
**Difficulty:** ★★★★★  
**Estimated Time:** 30 minutes  
**Tags:** `typescript`, `covariance`, `contravariance`, `type-safety`, `generics`  
**Prerequisites:** `ts-003-generic-constraints`, `ts-004-type-predicate`

---

## The Scenario

Your team's codebase has a hierarchy of types (Animal, Dog, GuideDog) with generic containers, handler functions, and factory functions. Several developers have been "fixing" type errors by adding `as` casts, creating a web of unsound type assignments. The code compiles, but at runtime, a `ReadonlyBox<Dog>` can have a Cat written into it, a `DogHandler` is used where an `AnimalHandler` is needed (and crashes when given a Cat), and a factory that produces generic Animals is typed as producing Dogs. Your task is to understand variance rules and restructure the code so that the type relationships are sound.

## The Bug

The code has multiple variance violations:

1. **ReadonlyBox has a `set()` method** -- this makes it invariant, but it's used as if covariant. A `ReadonlyBox<Dog>` assigned to `ReadonlyBox<Animal>` could then have a non-Dog written in.
2. **DogHandler cast to AnimalHandler** -- function parameters are contravariant. A `DogHandler` is MORE restrictive than an `AnimalHandler`, so this cast is unsound.
3. **AnimalFactory cast to DogFactory** -- return types are covariant. An `AnimalFactory` might return a non-Dog Animal, so it can't be used as a `DogFactory`.
4. **Mutable arrays** -- pushing a plain Dog into what might be a `GuideDog[]` is unsound.

## Your Task

1. Remove the `set()` method from `ReadonlyBox` to make it safely covariant
2. Remove the unsound `DogHandler -> AnimalHandler` cast
3. Remove the unsound `AnimalFactory -> DogFactory` cast
4. Remove the unsound `addDogToGuideDogs` function
5. Ensure the remaining code correctly uses contravariance for function parameters
6. Ensure all tests pass
7. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/variance.ts` | Generic containers and function types with variance violations |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [TypeScript Variance Annotations](https://www.typescriptlang.org/docs/handbook/2/generics.html#variance-annotations) -- `in`, `out` keywords
- [Covariance and Contravariance](https://en.wikipedia.org/wiki/Covariance_and_contravariance_(computer_science)) -- theoretical background
- [Liskov Substitution Principle](https://en.wikipedia.org/wiki/Liskov_substitution_principle) -- the OOP principle behind variance
