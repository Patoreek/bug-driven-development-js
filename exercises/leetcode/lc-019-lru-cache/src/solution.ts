/**
 * LRU Cache
 *
 * Design a data structure that follows the constraints of a
 * Least Recently Used (LRU) cache.
 *
 * Implement the LRUCache class:
 * - LRUCache(capacity) - Initialize the cache with positive size capacity
 * - get(key) - Return the value if the key exists, otherwise return -1
 * - put(key, value) - Update or insert the value. If the cache reaches
 *   capacity, evict the least recently used key before inserting.
 *
 * Current approach: Uses a Map for O(1) lookup, but tracks access order
 * with an array. `get` is O(1) but eviction in `put` requires scanning
 * the array for the LRU item — O(n).
 *
 * Target: Hash Map + Doubly Linked List for O(1) get and put.
 */

export class LRUCache {
  private capacity: number;
  private cache: Map<number, number>;
  private order: number[]; // tracks access order — least recent at index 0

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
    this.order = [];
  }

  get(key: number): number {
    if (!this.cache.has(key)) return -1;

    // Move key to end (most recently used)
    // This is O(n) — must find and remove from array
    const idx = this.order.indexOf(key);
    if (idx !== -1) {
      this.order.splice(idx, 1);
    }
    this.order.push(key);

    return this.cache.get(key)!;
  }

  put(key: number, value: number): void {
    if (this.cache.has(key)) {
      // Update existing: move to most recently used
      this.cache.set(key, value);
      const idx = this.order.indexOf(key);
      if (idx !== -1) {
        this.order.splice(idx, 1);
      }
      this.order.push(key);
      return;
    }

    // Evict if at capacity
    if (this.cache.size >= this.capacity) {
      const lruKey = this.order.shift()!; // O(n) shift operation
      this.cache.delete(lruKey);
    }

    this.cache.set(key, value);
    this.order.push(key);
  }
}
