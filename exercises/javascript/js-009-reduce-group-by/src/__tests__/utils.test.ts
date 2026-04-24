import { describe, it, expect } from "vitest";
import { groupBy, groupByProperty, countBy } from "../utils";

interface Order {
  id: number;
  status: string;
  total: number;
}

const orders: Order[] = [
  { id: 1, status: "pending", total: 50 },
  { id: 2, status: "shipped", total: 120 },
  { id: 3, status: "pending", total: 75 },
  { id: 4, status: "delivered", total: 200 },
  { id: 5, status: "shipped", total: 30 },
  { id: 6, status: "pending", total: 90 },
];

describe("groupBy", () => {
  it("should group items by the key function", () => {
    const result = groupBy(orders, (order) => order.status);

    expect(result["pending"]).toHaveLength(3);
    expect(result["shipped"]).toHaveLength(2);
    expect(result["delivered"]).toHaveLength(1);
  });

  it("should include all items in their correct groups", () => {
    const result = groupBy(orders, (order) => order.status);

    expect(result["pending"].map((o) => o.id)).toEqual([1, 3, 6]);
    expect(result["shipped"].map((o) => o.id)).toEqual([2, 5]);
    expect(result["delivered"].map((o) => o.id)).toEqual([4]);
  });

  it("should handle empty input", () => {
    const result = groupBy([], (item: string) => item);
    expect(result).toEqual({});
  });

  it("should handle all items in a single group", () => {
    const items = ["a", "a", "a"];
    const result = groupBy(items, (x) => x);
    expect(result["a"]).toEqual(["a", "a", "a"]);
    expect(result["a"]).toHaveLength(3);
  });

  it("should handle each item in its own group", () => {
    const items = ["a", "b", "c"];
    const result = groupBy(items, (x) => x);
    expect(Object.keys(result)).toHaveLength(3);
    expect(result["a"]).toEqual(["a"]);
    expect(result["b"]).toEqual(["b"]);
    expect(result["c"]).toEqual(["c"]);
  });

  it("should work with a computed key function", () => {
    const numbers = [1, 2, 3, 4, 5, 6];
    const result = groupBy(numbers, (n) => (n % 2 === 0 ? "even" : "odd"));
    expect(result["even"]).toEqual([2, 4, 6]);
    expect(result["odd"]).toEqual([1, 3, 5]);
  });
});

describe("groupByProperty", () => {
  it("should group objects by the specified property", () => {
    const result = groupByProperty(orders, "status");

    expect(result["pending"]).toHaveLength(3);
    expect(result["shipped"]).toHaveLength(2);
    expect(result["delivered"]).toHaveLength(1);
  });

  it("should preserve all items in groups", () => {
    const result = groupByProperty(orders, "status");
    const allItems = [
      ...result["pending"],
      ...result["shipped"],
      ...result["delivered"],
    ];
    expect(allItems).toHaveLength(orders.length);
  });

  it("should handle empty input", () => {
    const result = groupByProperty([], "status");
    expect(result).toEqual({});
  });
});

describe("countBy", () => {
  it("should count items per group", () => {
    const items = ["apple", "banana", "apple", "cherry", "banana", "apple"];
    const result = countBy(items, (x) => x);

    expect(result["apple"]).toBe(3);
    expect(result["banana"]).toBe(2);
    expect(result["cherry"]).toBe(1);
  });

  it("should count orders by status", () => {
    const result = countBy(orders, (order) => order.status);

    expect(result["pending"]).toBe(3);
    expect(result["shipped"]).toBe(2);
    expect(result["delivered"]).toBe(1);
  });

  it("should handle empty input", () => {
    const result = countBy([], (x: string) => x);
    expect(result).toEqual({});
  });

  it("should handle single item", () => {
    const result = countBy(["only"], (x) => x);
    expect(result["only"]).toBe(1);
  });
});
