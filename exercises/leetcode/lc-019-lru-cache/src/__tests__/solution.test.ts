import { describe, it, expect } from "vitest";
import { LRUCache } from "../solution";

describe("LRUCache", () => {
  it("should handle basic get and put operations", () => {
    const cache = new LRUCache(2);
    cache.put(1, 1);
    cache.put(2, 2);
    expect(cache.get(1)).toBe(1);
    cache.put(3, 3); // evicts key 2
    expect(cache.get(2)).toBe(-1);
    cache.put(4, 4); // evicts key 1
    expect(cache.get(1)).toBe(-1);
    expect(cache.get(3)).toBe(3);
    expect(cache.get(4)).toBe(4);
  });

  it("should return -1 for non-existent key", () => {
    const cache = new LRUCache(2);
    expect(cache.get(1)).toBe(-1);
  });

  it("should handle capacity of 1", () => {
    const cache = new LRUCache(1);
    cache.put(1, 1);
    expect(cache.get(1)).toBe(1);
    cache.put(2, 2); // evicts key 1
    expect(cache.get(1)).toBe(-1);
    expect(cache.get(2)).toBe(2);
  });

  it("should update existing key and move to front", () => {
    const cache = new LRUCache(2);
    cache.put(1, 1);
    cache.put(2, 2);
    cache.put(1, 10); // update key 1, should move to most recent
    cache.put(3, 3); // should evict key 2 (not key 1, since 1 was just accessed)
    expect(cache.get(2)).toBe(-1);
    expect(cache.get(1)).toBe(10);
    expect(cache.get(3)).toBe(3);
  });

  it("should handle get refreshing access order", () => {
    const cache = new LRUCache(2);
    cache.put(1, 1);
    cache.put(2, 2);
    cache.get(1); // access key 1 — now key 2 is LRU
    cache.put(3, 3); // evicts key 2
    expect(cache.get(2)).toBe(-1);
    expect(cache.get(1)).toBe(1);
    expect(cache.get(3)).toBe(3);
  });

  it("should handle interleaved operations", () => {
    const cache = new LRUCache(3);
    cache.put(1, 10);
    cache.put(2, 20);
    cache.put(3, 30);
    expect(cache.get(1)).toBe(10); // access 1, order: 2, 3, 1
    cache.put(4, 40); // evicts 2
    expect(cache.get(2)).toBe(-1);
    expect(cache.get(3)).toBe(30); // access 3, order: 1, 4, 3
    cache.put(5, 50); // evicts 1
    expect(cache.get(1)).toBe(-1);
    expect(cache.get(4)).toBe(40);
    expect(cache.get(5)).toBe(50);
  });

  it("should not evict when under capacity", () => {
    const cache = new LRUCache(5);
    cache.put(1, 1);
    cache.put(2, 2);
    cache.put(3, 3);
    expect(cache.get(1)).toBe(1);
    expect(cache.get(2)).toBe(2);
    expect(cache.get(3)).toBe(3);
  });

  it("should handle putting same key multiple times", () => {
    const cache = new LRUCache(2);
    cache.put(1, 1);
    cache.put(1, 2);
    cache.put(1, 3);
    expect(cache.get(1)).toBe(3);
  });

  it("should handle O(1) operations efficiently (performance test)", () => {
    const size = 50000;
    const cache = new LRUCache(size);

    // Fill cache to capacity
    for (let i = 0; i < size; i++) {
      cache.put(i, i);
    }

    const start = performance.now();
    // 200k get operations on a 50k-capacity cache
    // O(1) DLL impl: 200k pointer ops
    // O(n) array impl: 200k * 50k = 10 billion indexOf+splice ops
    for (let round = 0; round < 4; round++) {
      for (let i = 0; i < size; i++) {
        cache.get(i);
      }
    }
    const elapsed = performance.now() - start;

    // O(1) DLL should handle 200k ops well under 200ms
    expect(elapsed).toBeLessThan(200);

    // Verify correctness
    expect(cache.get(0)).toBe(0);
    expect(cache.get(size - 1)).toBe(size - 1);
  });

  it("should evict correct key after complex sequence", () => {
    const cache = new LRUCache(2);
    cache.put(2, 1);
    cache.put(1, 1);
    cache.put(2, 3); // update 2, LRU is now 1
    cache.put(4, 1); // evict 1
    expect(cache.get(1)).toBe(-1);
    expect(cache.get(2)).toBe(3);
  });
});
