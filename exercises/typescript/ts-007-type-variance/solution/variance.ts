// Solution: Correct variance usage

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

// FIX 1: ReadonlyBox is covariant — it only allows reading, not writing.
// Removing the `set` method makes the container safely covariant:
// ReadonlyBox<Dog> can be assigned to ReadonlyBox<Animal>.
export class ReadonlyBox<T> {
  constructor(private value: T) {}

  get(): T {
    return this.value;
  }

  // set() method removed — a read-only container is covariant
}

// --- Function types ---
export type AnimalHandler = (animal: Animal) => void;
export type DogHandler = (dog: Dog) => void;

// FIX 2: processAnimals correctly uses AnimalHandler — it passes Animals,
// so the handler must accept Animals. An AnimalHandler can also handle Dogs
// (contravariance), but a DogHandler CANNOT handle arbitrary Animals.
export function processAnimals(animals: Animal[], handler: AnimalHandler): void {
  for (const animal of animals) {
    handler(animal);
  }
}

// FIX 3: No more unsound DogHandler -> AnimalHandler cast.
// If you need a handler for Animals, it must be an AnimalHandler.
// Removed createDogHandlerPipeline — it was inherently unsound.

// --- Mutable array operations ---
export function addDogToAnimals(animals: Animal[]): void {
  animals.push({
    name: "Rex",
    sound: () => "Woof",
    breed: "Lab",
    fetch: () => "ball",
  } as Dog);
}

// FIX 4: Removed addDogToGuideDogs — pushing a plain Dog into a GuideDog[]
// is unsound because Dog doesn't have `handler` and `guide`.

// --- Factory types (covariant return) ---
export type AnimalFactory = () => Animal;
export type DogFactory = () => Dog;

// FIX 5: Removed getDogFactory — it returned an AnimalFactory as DogFactory,
// which is unsound (the returned Animal may not be a Dog).

// --- Safe handlers ---
export function safeDogHandler(dog: Dog): string {
  return `${dog.name} (${dog.breed}) says ${dog.sound()} and fetches ${dog.fetch()}`;
}

export function safeAnimalHandler(animal: Animal): string {
  return `${animal.name} says ${animal.sound()}`;
}

// FIX 6: processDogs accepts an AnimalHandler — this is SAFE because
// function params are contravariant: AnimalHandler handles ANY Animal,
// so it can definitely handle a Dog.
export function processDogs(dogs: Dog[], handler: AnimalHandler): string[] {
  return dogs.map((dog) => {
    handler(dog);
    return dog.name;
  });
}

// processSafely accepts a function that takes Animal and returns string
// Contravariance: this function can process Dogs because Dog extends Animal
export function processSafely(dogs: Dog[], handler: (animal: Animal) => string): string[] {
  return dogs.map((dog) => handler(dog));
}
