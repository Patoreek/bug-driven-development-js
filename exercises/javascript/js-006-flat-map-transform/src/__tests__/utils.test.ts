import { describe, it, expect } from "vitest";
import { getUniqueTags, expandOrders, getAllWords } from "../utils";
import type { Post, Order } from "../utils";

describe("getUniqueTags", () => {
  it("should return a flat array of unique tags", () => {
    const posts: Post[] = [
      { id: 1, title: "Post 1", tags: ["javascript", "react"] },
      { id: 2, title: "Post 2", tags: ["typescript", "react"] },
      { id: 3, title: "Post 3", tags: ["javascript", "node"] },
    ];
    const result = getUniqueTags(posts);
    expect(result).toEqual(["javascript", "node", "react", "typescript"]);
  });

  it("should return tags sorted alphabetically", () => {
    const posts: Post[] = [
      { id: 1, title: "A", tags: ["zebra", "apple"] },
      { id: 2, title: "B", tags: ["mango"] },
    ];
    expect(getUniqueTags(posts)).toEqual(["apple", "mango", "zebra"]);
  });

  it("should handle posts with no tags", () => {
    const posts: Post[] = [
      { id: 1, title: "Empty", tags: [] },
      { id: 2, title: "Also empty", tags: [] },
    ];
    expect(getUniqueTags(posts)).toEqual([]);
  });

  it("should handle an empty posts array", () => {
    expect(getUniqueTags([])).toEqual([]);
  });

  it("should not contain nested arrays", () => {
    const posts: Post[] = [
      { id: 1, title: "A", tags: ["a", "b"] },
    ];
    const result = getUniqueTags(posts);
    result.forEach((tag) => {
      expect(typeof tag).toBe("string");
    });
  });

  it("should deduplicate tags that appear in multiple posts", () => {
    const posts: Post[] = [
      { id: 1, title: "A", tags: ["shared"] },
      { id: 2, title: "B", tags: ["shared"] },
      { id: 3, title: "C", tags: ["shared", "unique"] },
    ];
    expect(getUniqueTags(posts)).toEqual(["shared", "unique"]);
  });
});

describe("expandOrders", () => {
  it("should expand orders into individual order lines", () => {
    const orders: Order[] = [
      { orderId: "ORD-1", items: ["Widget", "Gadget"] },
      { orderId: "ORD-2", items: ["Doohickey"] },
    ];
    const result = expandOrders(orders);
    expect(result).toEqual([
      { orderId: "ORD-1", item: "Widget" },
      { orderId: "ORD-1", item: "Gadget" },
      { orderId: "ORD-2", item: "Doohickey" },
    ]);
  });

  it("should return a flat array (not nested)", () => {
    const orders: Order[] = [
      { orderId: "A", items: ["x", "y"] },
    ];
    const result = expandOrders(orders);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);
    expect(result[0]).toHaveProperty("orderId");
    expect(result[0]).toHaveProperty("item");
  });

  it("should handle orders with no items", () => {
    const orders: Order[] = [
      { orderId: "EMPTY", items: [] },
      { orderId: "A", items: ["x"] },
    ];
    expect(expandOrders(orders)).toEqual([{ orderId: "A", item: "x" }]);
  });

  it("should handle an empty orders array", () => {
    expect(expandOrders([])).toEqual([]);
  });

  it("should produce correct count of order lines", () => {
    const orders: Order[] = [
      { orderId: "A", items: ["1", "2", "3"] },
      { orderId: "B", items: ["4", "5"] },
      { orderId: "C", items: ["6"] },
    ];
    expect(expandOrders(orders)).toHaveLength(6);
  });
});

describe("getAllWords", () => {
  it("should return a flat array of all words", () => {
    const sentences = ["hello world", "foo bar baz"];
    const result = getAllWords(sentences);
    expect(result).toEqual(["hello", "world", "foo", "bar", "baz"]);
  });

  it("should handle single-word sentences", () => {
    expect(getAllWords(["hello", "world"])).toEqual(["hello", "world"]);
  });

  it("should return strings, not arrays", () => {
    const result = getAllWords(["a b", "c d"]);
    result.forEach((word) => {
      expect(typeof word).toBe("string");
    });
  });

  it("should handle an empty array", () => {
    expect(getAllWords([])).toEqual([]);
  });

  it("should filter out empty strings from extra spaces", () => {
    const result = getAllWords(["hello  world"]);
    expect(result).not.toContain("");
  });
});
