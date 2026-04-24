import { describe, it, expect } from "vitest";
import { calculateTotal, flattenArrays, groupBy } from "../utils";
import type { CartItem } from "../utils";

describe("calculateTotal", () => {
  it("should sum prices correctly for multiple items", () => {
    const items: CartItem[] = [
      { name: "Widget", price: 10, quantity: 2 },
      { name: "Gadget", price: 25, quantity: 1 },
      { name: "Doohickey", price: 5, quantity: 3 },
    ];
    expect(calculateTotal(items)).toBe(60); // 20 + 25 + 15
  });

  it("should return 0 for an empty cart", () => {
    expect(calculateTotal([])).toBe(0);
  });

  it("should handle a single item", () => {
    const items: CartItem[] = [{ name: "Solo", price: 42, quantity: 1 }];
    expect(calculateTotal(items)).toBe(42);
  });

  it("should return a number, not an object", () => {
    const items: CartItem[] = [
      { name: "A", price: 10, quantity: 1 },
      { name: "B", price: 20, quantity: 1 },
    ];
    const result = calculateTotal(items);
    expect(typeof result).toBe("number");
  });
});

describe("flattenArrays", () => {
  it("should flatten multiple arrays into one", () => {
    expect(flattenArrays([[1, 2], [3, 4], [5]])).toEqual([1, 2, 3, 4, 5]);
  });

  it("should return an empty array when given an empty array of arrays", () => {
    expect(flattenArrays([])).toEqual([]);
  });

  it("should handle arrays with empty sub-arrays", () => {
    expect(flattenArrays([[1], [], [2, 3], []])).toEqual([1, 2, 3]);
  });

  it("should handle a single sub-array", () => {
    expect(flattenArrays([[1, 2, 3]])).toEqual([1, 2, 3]);
  });

  it("should flatten string arrays", () => {
    expect(flattenArrays([["a", "b"], ["c"]])).toEqual(["a", "b", "c"]);
  });
});

describe("groupBy", () => {
  it("should group items by the provided key function", () => {
    const items = [
      { type: "fruit", name: "apple" },
      { type: "veggie", name: "carrot" },
      { type: "fruit", name: "banana" },
    ];
    const result = groupBy(items, (item) => item.type);
    expect(result).toEqual({
      fruit: [
        { type: "fruit", name: "apple" },
        { type: "fruit", name: "banana" },
      ],
      veggie: [{ type: "veggie", name: "carrot" }],
    });
  });

  it("should return an empty object for an empty array", () => {
    expect(groupBy([], (item: string) => item)).toEqual({});
  });

  it("should handle all items in the same group", () => {
    const items = [{ cat: "a" }, { cat: "a" }, { cat: "a" }];
    const result = groupBy(items, () => "all");
    expect(result).toEqual({
      all: [{ cat: "a" }, { cat: "a" }, { cat: "a" }],
    });
  });
});
