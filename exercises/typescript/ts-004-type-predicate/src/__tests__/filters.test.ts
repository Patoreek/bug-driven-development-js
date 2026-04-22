import { describe, it, expect } from "vitest";
import {
  isCat,
  isDog,
  isFish,
  getCats,
  getDogs,
  getFish,
  isNonNullable,
  filterNullish,
  isSuccess,
  getSuccessData,
  type Animal,
  type Cat,
  type Dog,
  type Fish,
  type Result,
} from "../filters";

const animals: Animal[] = [
  { kind: "cat", name: "Whiskers", indoor: true },
  { kind: "dog", name: "Rex", breed: "German Shepherd" },
  { kind: "cat", name: "Luna", indoor: false },
  { kind: "fish", name: "Nemo", freshwater: false },
  { kind: "dog", name: "Buddy", breed: "Golden Retriever" },
];

describe("type guard functions", () => {
  it("isCat correctly identifies cats", () => {
    expect(isCat(animals[0])).toBe(true);
    expect(isCat(animals[1])).toBe(false);
  });

  it("isDog correctly identifies dogs", () => {
    expect(isDog(animals[1])).toBe(true);
    expect(isDog(animals[0])).toBe(false);
  });

  it("isFish correctly identifies fish", () => {
    expect(isFish(animals[3])).toBe(true);
    expect(isFish(animals[0])).toBe(false);
  });
});

describe("getCats", () => {
  it("returns only cat animals", () => {
    const cats = getCats(animals);
    expect(cats).toHaveLength(2);
    expect(cats[0].name).toBe("Whiskers");
    expect(cats[1].name).toBe("Luna");
  });

  it("each result has the indoor property (cat-specific)", () => {
    const cats = getCats(animals);
    for (const cat of cats) {
      expect(cat).toHaveProperty("indoor");
      // This line verifies type narrowing works — accessing cat.indoor
      // should compile without errors when the type predicate is correct
      expect(typeof cat.indoor).toBe("boolean");
    }
  });
});

describe("getDogs", () => {
  it("returns only dog animals", () => {
    const dogs = getDogs(animals);
    expect(dogs).toHaveLength(2);
    expect(dogs[0].name).toBe("Rex");
  });

  it("each result has the breed property (dog-specific)", () => {
    const dogs = getDogs(animals);
    for (const dog of dogs) {
      expect(dog).toHaveProperty("breed");
      expect(typeof dog.breed).toBe("string");
    }
  });
});

describe("getFish", () => {
  it("returns only fish animals", () => {
    const fish = getFish(animals);
    expect(fish).toHaveLength(1);
    expect(fish[0].name).toBe("Nemo");
  });

  it("each result has the freshwater property (fish-specific)", () => {
    const fish = getFish(animals);
    for (const f of fish) {
      expect(f).toHaveProperty("freshwater");
      expect(typeof f.freshwater).toBe("boolean");
    }
  });
});

describe("isNonNullable", () => {
  it("returns true for non-null values", () => {
    expect(isNonNullable("hello")).toBe(true);
    expect(isNonNullable(0)).toBe(true);
    expect(isNonNullable("")).toBe(true);
    expect(isNonNullable(false)).toBe(true);
  });

  it("returns false for null and undefined", () => {
    expect(isNonNullable(null)).toBe(false);
    expect(isNonNullable(undefined)).toBe(false);
  });
});

describe("filterNullish", () => {
  it("removes null and undefined from array", () => {
    const items = ["hello", null, "world", undefined, "foo"];
    const result = filterNullish(items);
    expect(result).toEqual(["hello", "world", "foo"]);
  });

  it("returns empty array when all nullish", () => {
    const result = filterNullish([null, undefined, null]);
    expect(result).toEqual([]);
  });

  it("returns all items when none are nullish", () => {
    const result = filterNullish(["a", "b", "c"]);
    expect(result).toEqual(["a", "b", "c"]);
  });
});

describe("isSuccess and getSuccessData", () => {
  const results: Result[] = [
    { success: true, data: "item1" },
    { success: false, error: "not found" },
    { success: true, data: "item2" },
    { success: false, error: "timeout" },
  ];

  it("isSuccess correctly identifies success results", () => {
    expect(isSuccess(results[0])).toBe(true);
    expect(isSuccess(results[1])).toBe(false);
  });

  it("getSuccessData extracts data from successful results only", () => {
    const data = getSuccessData(results);
    expect(data).toEqual(["item1", "item2"]);
  });

  it("getSuccessData returns empty array when all results are errors", () => {
    const errors: Result[] = [
      { success: false, error: "a" },
      { success: false, error: "b" },
    ];
    expect(getSuccessData(errors)).toEqual([]);
  });
});
