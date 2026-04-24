import { describe, it, expect } from "vitest";
import { sortProducts, sortNumbers, sortByDate } from "../utils";
import type { Product, CalendarEvent } from "../utils";

describe("sortNumbers", () => {
  it("should sort single-digit numbers correctly", () => {
    expect(sortNumbers([3, 1, 4, 1, 5])).toEqual([1, 1, 3, 4, 5]);
  });

  it("should sort multi-digit numbers numerically, not lexicographically", () => {
    expect(sortNumbers([10, 9, 2, 21, 3])).toEqual([2, 3, 9, 10, 21]);
  });

  it("should handle numbers where lexicographic and numeric order differ", () => {
    expect(sortNumbers([100, 20, 3, 1000, 40])).toEqual([3, 20, 40, 100, 1000]);
  });

  it("should handle negative numbers", () => {
    expect(sortNumbers([5, -3, 0, -10, 8])).toEqual([-10, -3, 0, 5, 8]);
  });

  it("should handle an empty array", () => {
    expect(sortNumbers([])).toEqual([]);
  });

  it("should not mutate the original array", () => {
    const original = [3, 1, 2];
    sortNumbers(original);
    expect(original).toEqual([3, 1, 2]);
  });
});

describe("sortProducts", () => {
  it("should sort products by price ascending", () => {
    const products: Product[] = [
      { name: "Keyboard", price: 99 },
      { name: "Mouse", price: 25 },
      { name: "Monitor", price: 350 },
      { name: "Cable", price: 8 },
    ];
    const sorted = sortProducts(products);
    expect(sorted.map((p) => p.price)).toEqual([8, 25, 99, 350]);
  });

  it("should handle prices where string comparison fails", () => {
    const products: Product[] = [
      { name: "A", price: 100 },
      { name: "B", price: 20 },
      { name: "C", price: 9 },
    ];
    const sorted = sortProducts(products);
    expect(sorted.map((p) => p.price)).toEqual([9, 20, 100]);
  });

  it("should handle decimal prices", () => {
    const products: Product[] = [
      { name: "A", price: 9.99 },
      { name: "B", price: 10.5 },
      { name: "C", price: 9.5 },
    ];
    const sorted = sortProducts(products);
    expect(sorted.map((p) => p.price)).toEqual([9.5, 9.99, 10.5]);
  });
});

describe("sortByDate", () => {
  it("should sort events chronologically", () => {
    const events: CalendarEvent[] = [
      { title: "Meeting", date: "2024-03-15" },
      { title: "Lunch", date: "2024-01-10" },
      { title: "Review", date: "2024-06-01" },
      { title: "Standup", date: "2024-02-28" },
    ];
    const sorted = sortByDate(events);
    expect(sorted.map((e) => e.date)).toEqual([
      "2024-01-10",
      "2024-02-28",
      "2024-03-15",
      "2024-06-01",
    ]);
  });

  it("should handle events across different years", () => {
    const events: CalendarEvent[] = [
      { title: "A", date: "2025-01-01" },
      { title: "B", date: "2023-12-31" },
      { title: "C", date: "2024-06-15" },
    ];
    const sorted = sortByDate(events);
    expect(sorted.map((e) => e.date)).toEqual([
      "2023-12-31",
      "2024-06-15",
      "2025-01-01",
    ]);
  });

  it("should handle a single event", () => {
    const events: CalendarEvent[] = [{ title: "Solo", date: "2024-05-01" }];
    expect(sortByDate(events)).toEqual([{ title: "Solo", date: "2024-05-01" }]);
  });
});
