import { describe, it, expect } from "vitest";
import {
  ReadonlyBox,
  safeDogHandler,
  safeAnimalHandler,
  processSafely,
  addDogToAnimals,
  type Animal,
  type Dog,
  type GuideDog,
} from "../variance";

// Test fixtures
const dog: Dog = {
  name: "Rex",
  breed: "German Shepherd",
  sound: () => "Woof!",
  fetch: () => "ball",
};

const guideDog: GuideDog = {
  name: "Lassie",
  breed: "Collie",
  sound: () => "Bark!",
  fetch: () => "stick",
  handler: "John",
  guide: () => "leading to exit",
};

const animal: Animal = {
  name: "Cat",
  sound: () => "Meow",
};

describe("ReadonlyBox - covariant container", () => {
  it("should store and retrieve a value", () => {
    const box = new ReadonlyBox(dog);
    expect(box.get().name).toBe("Rex");
  });

  it("should be read-only — no set method", () => {
    const box = new ReadonlyBox(42);
    // A truly covariant (read-only) container should NOT have a set method
    expect((box as any).set).toBeUndefined();
  });

  it("a ReadonlyBox<Dog> should be usable where ReadonlyBox<Animal> is expected", () => {
    const dogBox = new ReadonlyBox(dog);
    // Covariance: Dog extends Animal, so ReadonlyBox<Dog> -> ReadonlyBox<Animal> is safe
    // for reading. This test just verifies the value can be treated as Animal.
    const animalName: string = dogBox.get().name;
    expect(animalName).toBe("Rex");
  });

  it("should work with GuideDog as well", () => {
    const gdBox = new ReadonlyBox(guideDog);
    expect(gdBox.get().handler).toBe("John");
    expect(gdBox.get().name).toBe("Lassie");
  });
});

describe("Function variance", () => {
  it("safeAnimalHandler works on any animal", () => {
    expect(safeAnimalHandler(animal)).toContain("Cat");
    expect(safeAnimalHandler(animal)).toContain("Meow");
  });

  it("safeAnimalHandler also works on dogs (covariant argument)", () => {
    const result = safeAnimalHandler(dog);
    expect(result).toContain("Rex");
    expect(result).toContain("Woof");
  });

  it("safeDogHandler works on dogs", () => {
    const result = safeDogHandler(dog);
    expect(result).toContain("Rex");
    expect(result).toContain("German Shepherd");
    expect(result).toContain("ball");
  });

  it("safeDogHandler works on guide dogs (subtype of Dog)", () => {
    const result = safeDogHandler(guideDog);
    expect(result).toContain("Lassie");
    expect(result).toContain("Collie");
  });
});

describe("processSafely - contravariant parameter", () => {
  it("accepts a handler that takes Animal to process Dogs", () => {
    // Contravariance: AnimalHandler can be used where DogHandler is expected
    // because it can handle any Animal, which includes Dogs.
    const results = processSafely([dog, guideDog], safeAnimalHandler);
    expect(results).toHaveLength(2);
    expect(results[0]).toContain("Rex");
    expect(results[1]).toContain("Lassie");
  });
});

describe("addDogToAnimals", () => {
  it("adds a dog to an animal array", () => {
    const animals: Animal[] = [animal];
    addDogToAnimals(animals);
    expect(animals).toHaveLength(2);
    expect(animals[1].name).toBe("Rex");
  });

  it("added dog can make sound", () => {
    const animals: Animal[] = [];
    addDogToAnimals(animals);
    expect(animals[0].sound()).toBe("Woof");
  });
});

describe("type safety through design", () => {
  it("ReadonlyBox prevents mutation that would violate type safety", () => {
    // If ReadonlyBox had a `set()` method, this would be unsound:
    // const dogBox: ReadonlyBox<Dog> = new ReadonlyBox(dog);
    // const animalBox: ReadonlyBox<Animal> = dogBox; // covariance
    // animalBox.set(cat); // writes a Cat into what's supposed to be a Dog box!
    //
    // By removing `set()`, the container is safely covariant.
    const box = new ReadonlyBox(dog);
    const value = box.get();
    expect(value.name).toBe("Rex");
    expect(value.breed).toBe("German Shepherd");
  });
});
