import { describe, it, expect } from "vitest";
import {
  getTopScores,
  getSortedByName,
  getMedian,
  getProductViews,
} from "../utils";

describe("getTopScores", () => {
  it("should return the top N scores in descending order", () => {
    const scores = [72, 95, 88, 61, 100, 45];
    expect(getTopScores(scores, 3)).toEqual([100, 95, 88]);
  });

  it("should NOT mutate the original array", () => {
    const scores = [72, 95, 88, 61, 100, 45];
    const original = [...scores];
    getTopScores(scores, 3);
    expect(scores).toEqual(original);
  });

  it("should handle n larger than array length", () => {
    const scores = [10, 20];
    expect(getTopScores(scores, 5)).toEqual([20, 10]);
  });

  it("should handle n of 0", () => {
    expect(getTopScores([1, 2, 3], 0)).toEqual([]);
  });

  it("should handle empty array", () => {
    expect(getTopScores([], 3)).toEqual([]);
  });
});

describe("getSortedByName", () => {
  it("should return items sorted by name alphabetically", () => {
    const items = [
      { name: "Charlie", age: 30 },
      { name: "Alice", age: 25 },
      { name: "Bob", age: 28 },
    ];
    const sorted = getSortedByName(items);
    expect(sorted.map((i) => i.name)).toEqual(["Alice", "Bob", "Charlie"]);
  });

  it("should NOT mutate the original array", () => {
    const items = [
      { name: "Charlie", age: 30 },
      { name: "Alice", age: 25 },
      { name: "Bob", age: 28 },
    ];
    const originalOrder = items.map((i) => i.name);
    getSortedByName(items);
    expect(items.map((i) => i.name)).toEqual(originalOrder);
  });

  it("should handle empty array", () => {
    expect(getSortedByName([])).toEqual([]);
  });

  it("should handle single item", () => {
    const items = [{ name: "Solo" }];
    expect(getSortedByName(items)).toEqual([{ name: "Solo" }]);
  });
});

describe("getMedian", () => {
  it("should return median for odd-length array", () => {
    expect(getMedian([3, 1, 2])).toBe(2);
  });

  it("should return median for even-length array", () => {
    expect(getMedian([4, 1, 3, 2])).toBe(2.5);
  });

  it("should NOT mutate the original array", () => {
    const numbers = [5, 3, 1, 4, 2];
    const original = [...numbers];
    getMedian(numbers);
    expect(numbers).toEqual(original);
  });

  it("should handle single element", () => {
    expect(getMedian([42])).toBe(42);
  });

  it("should handle already sorted array", () => {
    expect(getMedian([1, 2, 3, 4, 5])).toBe(3);
  });
});

describe("getProductViews", () => {
  it("should return products sorted by price in byPrice", () => {
    const products = [
      { name: "Keyboard", price: 99 },
      { name: "Mouse", price: 25 },
      { name: "Monitor", price: 350 },
    ];
    const views = getProductViews(products);
    expect(views.byPrice.map((p) => p.price)).toEqual([25, 99, 350]);
  });

  it("should preserve original order in featured", () => {
    const products = [
      { name: "Keyboard", price: 99 },
      { name: "Mouse", price: 25 },
      { name: "Monitor", price: 350 },
    ];
    const originalOrder = products.map((p) => p.name);
    const views = getProductViews(products);
    expect(views.featured.map((p) => p.name)).toEqual(originalOrder);
  });

  it("should NOT mutate the original products array", () => {
    const products = [
      { name: "Keyboard", price: 99 },
      { name: "Mouse", price: 25 },
      { name: "Monitor", price: 350 },
    ];
    const originalOrder = products.map((p) => p.name);
    getProductViews(products);
    expect(products.map((p) => p.name)).toEqual(originalOrder);
  });

  it("should return different array references for featured and byPrice", () => {
    const products = [
      { name: "A", price: 30 },
      { name: "B", price: 10 },
    ];
    const views = getProductViews(products);
    expect(views.featured).not.toBe(views.byPrice);
  });
});
