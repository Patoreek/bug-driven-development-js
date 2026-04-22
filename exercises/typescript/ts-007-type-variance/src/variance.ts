// BUG: This module demonstrates type variance issues. Functions and containers
// have incorrect variance annotations/assumptions, leading to unsound type
// assignments that cause runtime errors.

// --- Animal hierarchy ---
export interface Animal {
  name: string;
  sound(): string;
}

export interface Dog extends Animal {
  breed: string;
  fetch(): string;
}

export interface GuideDog extends Dog {
  handler: string;
  guide(): string;
}

// --- BUG 1: Covariant container used as if it were invariant ---
// This container is read-only (covariant in T), but the type doesn't enforce that.
// It exposes a `set` method that allows unsound writes.
export class ReadonlyBox<T> {
  constructor(private value: T) {}

  get(): T {
    return this.value;
  }

  // BUG: This setter makes the container invariant, but we use it as if covariant.
  // A ReadonlyBox<Dog> assigned to ReadonlyBox<Animal> could then have a Cat written to it.
  set(newValue: T): void {
    this.value = newValue;
  }
}

// --- BUG 2: Function parameter types (contravariant) used incorrectly ---
export type AnimalHandler = (animal: Animal) => void;
export type DogHandler = (dog: Dog) => void;

// BUG: Assigns a DogHandler where an AnimalHandler is expected.
// DogHandler is MORE restrictive (expects Dog), so it can't handle any Animal.
// This is a contravariance violation: function params are contravariant.
export function processAnimals(animals: Animal[], handler: AnimalHandler): void {
  for (const animal of animals) {
    handler(animal);
  }
}

// BUG: This function creates a handler pipeline that has variance issues
export function createDogHandlerPipeline(): AnimalHandler {
  // BUG: Returns a handler that expects dog-specific properties
  // but is typed as AnimalHandler (accepts any Animal)
  const handler: DogHandler = (dog: Dog) => {
    console.log(`${dog.name} is a ${dog.breed}`);
    dog.fetch();
  };

  // BUG: Unsound assignment — DogHandler should NOT be assignable to AnimalHandler
  return handler as AnimalHandler;
}

// --- BUG 3: Mutable array variance ---
export function addDogToAnimals(animals: Animal[]): void {
  animals.push({ name: "Rex", sound: () => "Woof", breed: "Lab", fetch: () => "ball" } as Dog);
}

// BUG: TypeScript allows this but it's conceptually wrong —
// a GuideDog[] passed to this function could have a plain Dog pushed into it
export function addDogToGuideDogs(dogs: Dog[]): void {
  dogs.push({
    name: "Buddy",
    sound: () => "Woof",
    breed: "Retriever",
    fetch: () => "stick",
  });
}

// --- BUG 4: Return type variance (covariant) used incorrectly ---
export type AnimalFactory = () => Animal;
export type DogFactory = () => Dog;

// BUG: Assigns AnimalFactory where DogFactory is expected.
// Return types are covariant: DogFactory is a subtype of AnimalFactory (not vice versa).
export function getDogFactory(): DogFactory {
  // BUG: Returns a factory that might produce a non-Dog Animal
  const factory: AnimalFactory = () => ({
    name: "Generic Animal",
    sound: () => "...",
  });

  return factory as DogFactory;
}

// --- Safe versions that the tests expect ---
export function safeDogHandler(dog: Dog): string {
  return `${dog.name} (${dog.breed}) says ${dog.sound()} and fetches ${dog.fetch()}`;
}

export function safeAnimalHandler(animal: Animal): string {
  return `${animal.name} says ${animal.sound()}`;
}

// BUG: Processes dogs but accepts AnimalHandler — should work because
// AnimalHandler(contravariant) can handle the more specific Dog type.
// But the implementation passes animals as-is without checking.
export function processDogs(dogs: Dog[], handler: AnimalHandler): string[] {
  return dogs.map((dog) => {
    handler(dog);
    return dog.name;
  });
}

export function processSafely(dogs: Dog[], handler: (animal: Animal) => string): string[] {
  return dogs.map((dog) => handler(dog));
}
