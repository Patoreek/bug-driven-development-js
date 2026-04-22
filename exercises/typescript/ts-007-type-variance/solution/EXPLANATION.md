# Solution: Type Variance

## The Bug

The code has multiple variance violations hidden behind `as` casts:

### 1. ReadonlyBox is not actually read-only

```ts
// BUG: set() makes this invariant, but it's used as covariant
class ReadonlyBox<T> {
  get(): T { return this.value; }
  set(newValue: T): void { this.value = newValue; } // this is the problem
}
```

If `ReadonlyBox<Dog>` is assigned to `ReadonlyBox<Animal>`, calling `animalBox.set(cat)` would write a Cat into a Dog box.

### 2. DogHandler cast to AnimalHandler (contravariance violation)

```ts
// BUG: DogHandler expects Dog.breed and Dog.fetch()
const handler: DogHandler = (dog: Dog) => { dog.fetch(); };
return handler as AnimalHandler; // will crash on plain Animals!
```

Function parameters are **contravariant**: `AnimalHandler` is a subtype of `DogHandler` (not the reverse), because a handler that accepts any Animal is more flexible than one that requires a Dog.

### 3. AnimalFactory cast to DogFactory (covariance violation)

```ts
// BUG: This factory produces generic Animals, not Dogs
const factory: AnimalFactory = () => ({ name: "Generic", sound: () => "..." });
return factory as DogFactory; // returned value won't have breed or fetch!
```

Return types are **covariant**: `DogFactory` is a subtype of `AnimalFactory` (not the reverse), because a factory that always produces Dogs is more specific than one that produces any Animal.

## The Fix

```ts
// FIX 1: Remove set() to make ReadonlyBox safely covariant
class ReadonlyBox<T> {
  constructor(private value: T) {}
  get(): T { return this.value; }
  // No set() — read-only containers are safely covariant
}

// FIX 2: Remove createDogHandlerPipeline entirely — it was inherently unsound
// FIX 3: Remove getDogFactory entirely — it was inherently unsound
// FIX 4: Remove addDogToGuideDogs — pushing Dog into GuideDog[] is unsound
```

## The Rules of Variance

| Position | Variance | Rule |
|----------|----------|------|
| Container read (output) | **Covariant** | `Box<Dog>` -> `Box<Animal>` if read-only |
| Container write (input) | **Contravariant** | `Box<Animal>` -> `Box<Dog>` if write-only |
| Container read+write | **Invariant** | Must be exact type match |
| Function parameter | **Contravariant** | `(Animal) => void` is subtype of `(Dog) => void` |
| Function return | **Covariant** | `() => Dog` is subtype of `() => Animal` |

The mnemonic: **Producers are covariant, Consumers are contravariant** (the PECS principle from Java).

## Why This Matters

TypeScript is intentionally unsound in a few places (mutable arrays are treated as covariant for practicality), but understanding variance helps you:

1. Design APIs that are sound by construction (read-only containers, etc.)
2. Understand why some type assignments fail and others don't
3. Avoid `as` casts that create runtime type safety holes
4. Use TypeScript 4.7+ variance annotations (`in`/`out`) effectively

## Interview Context

Type variance is one of the most advanced TypeScript (and programming language theory) topics. Interview questions might ask: "Explain covariance and contravariance with an example," or "Why can't you assign a `List<Dog>` to a `List<Animal>` in Java?" Understanding this concept demonstrates deep type theory knowledge. The key insight is that mutability determines whether subtyping is safe.

## Further Reading

- [TypeScript Variance Annotations](https://www.typescriptlang.org/docs/handbook/2/generics.html#variance-annotations)
- [Covariance and Contravariance (Wikipedia)](https://en.wikipedia.org/wiki/Covariance_and_contravariance_(computer_science))
- [Liskov Substitution Principle](https://en.wikipedia.org/wiki/Liskov_substitution_principle)
