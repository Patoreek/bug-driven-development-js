import { describe, it, expect, vi } from "vitest";
import {
  createObjectCache,
  createNodeMetadataStore,
  memoizeByObject,
} from "../utils";

describe("createObjectCache", () => {
  it("should store and retrieve values by object key", () => {
    const cache = createObjectCache<string>();
    const key = { id: 1 };

    cache.set(key, "hello");
    expect(cache.get(key)).toBe("hello");
  });

  it("should return undefined for unknown keys", () => {
    const cache = createObjectCache<string>();
    const key = { id: 1 };

    expect(cache.get(key)).toBeUndefined();
  });

  it("should report has correctly", () => {
    const cache = createObjectCache<string>();
    const key = { id: 1 };

    expect(cache.has(key)).toBe(false);
    cache.set(key, "hello");
    expect(cache.has(key)).toBe(true);
  });

  it("should delete entries", () => {
    const cache = createObjectCache<string>();
    const key = { id: 1 };

    cache.set(key, "hello");
    expect(cache.has(key)).toBe(true);

    cache.delete(key);
    expect(cache.has(key)).toBe(false);
    expect(cache.get(key)).toBeUndefined();
  });

  it("should use different object references as different keys", () => {
    const cache = createObjectCache<string>();
    const key1 = { id: 1 };
    const key2 = { id: 1 }; // Same shape, different reference

    cache.set(key1, "first");
    cache.set(key2, "second");

    expect(cache.get(key1)).toBe("first");
    expect(cache.get(key2)).toBe("second");
  });

  it("should NOT expose a size property (WeakMap has no size)", () => {
    const cache = createObjectCache<string>();
    // WeakMap-backed cache cannot expose size
    expect(cache).not.toHaveProperty("size");
  });

  it("should NOT expose an entries method (WeakMap is not iterable)", () => {
    const cache = createObjectCache<string>();
    // WeakMap-backed cache cannot be iterated
    expect(cache).not.toHaveProperty("entries");
  });
});

describe("createNodeMetadataStore", () => {
  it("should store and retrieve metadata for a node", () => {
    const store = createNodeMetadataStore();
    const node = { tagName: "div" };

    store.setMetadata(node, "highlighted", true);
    expect(store.getMetadata(node, "highlighted")).toBe(true);
  });

  it("should return undefined for unset metadata", () => {
    const store = createNodeMetadataStore();
    const node = { tagName: "div" };

    expect(store.getMetadata(node, "anything")).toBeUndefined();
  });

  it("should track metadata presence", () => {
    const store = createNodeMetadataStore();
    const node = { tagName: "div" };

    expect(store.hasMetadata(node)).toBe(false);
    store.setMetadata(node, "color", "red");
    expect(store.hasMetadata(node)).toBe(true);
  });

  it("should store multiple metadata keys per node", () => {
    const store = createNodeMetadataStore();
    const node = { tagName: "span" };

    store.setMetadata(node, "color", "red");
    store.setMetadata(node, "fontSize", 14);

    expect(store.getMetadata(node, "color")).toBe("red");
    expect(store.getMetadata(node, "fontSize")).toBe(14);
  });

  it("should NOT expose a count property (WeakMap has no size)", () => {
    const store = createNodeMetadataStore();
    expect(store).not.toHaveProperty("count");
  });
});

describe("memoizeByObject", () => {
  it("should call the function on first invocation", () => {
    const fn = vi.fn((obj: { n: number }) => obj.n * 2);
    const memoized = memoizeByObject(fn);

    const key = { n: 5 };
    expect(memoized(key)).toBe(10);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should return cached result on subsequent calls with same key", () => {
    const fn = vi.fn((obj: { n: number }) => obj.n * 2);
    const memoized = memoizeByObject(fn);

    const key = { n: 5 };
    memoized(key);
    memoized(key);
    memoized(key);

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should call function again for different object references", () => {
    const fn = vi.fn((obj: { n: number }) => obj.n * 2);
    const memoized = memoizeByObject(fn);

    const key1 = { n: 5 };
    const key2 = { n: 5 }; // Same shape, different ref

    memoized(key1);
    memoized(key2);

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("should return the correct cached value per key", () => {
    const fn = vi.fn((obj: { n: number }) => obj.n * 3);
    const memoized = memoizeByObject(fn);

    const a = { n: 2 };
    const b = { n: 7 };

    expect(memoized(a)).toBe(6);
    expect(memoized(b)).toBe(21);
    expect(memoized(a)).toBe(6); // Cached
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
