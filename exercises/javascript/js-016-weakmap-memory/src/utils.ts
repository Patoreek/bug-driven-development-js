/**
 * A cache that stores computed results keyed by object references.
 * Uses a Map internally -- but should it?
 *
 * The intent is that when the key object is no longer referenced
 * anywhere else, the cached entry should be garbage-collected.
 */

export interface CacheEntry<T> {
  value: T;
  createdAt: number;
}

/**
 * Creates an object cache that should allow garbage collection of
 * entries whose keys are no longer referenced elsewhere.
 *
 * BUG: Uses a regular Map instead of a WeakMap, which prevents
 * garbage collection of key objects. The cache grows unboundedly.
 */
export function createObjectCache<T>() {
  // BUG: Should be a WeakMap so that entries are garbage-collected
  // when the key object is no longer referenced elsewhere.
  const cache = new Map<object, CacheEntry<T>>();

  return {
    set(key: object, value: T): void {
      cache.set(key, { value, createdAt: Date.now() });
    },

    get(key: object): T | undefined {
      const entry = cache.get(key);
      return entry?.value;
    },

    has(key: object): boolean {
      return cache.has(key);
    },

    // BUG: This method exposes the size, which is only possible
    // with Map. WeakMap doesn't have a size property because
    // its entries can be garbage-collected at any time.
    get size(): number {
      return cache.size;
    },

    // BUG: This method iterates entries, which is only possible
    // with Map. WeakMap is not iterable because its entries can
    // disappear at any time due to garbage collection.
    entries(): Array<[object, CacheEntry<T>]> {
      return Array.from(cache.entries());
    },

    delete(key: object): boolean {
      return cache.delete(key);
    },
  };
}

/**
 * Attaches private metadata to DOM-like node objects.
 * The metadata should not prevent the node from being garbage-collected.
 *
 * BUG: Uses a regular object/Map to store metadata, creating strong
 * references that prevent garbage collection.
 */
export function createNodeMetadataStore() {
  // BUG: Using a Map creates strong references to node objects.
  // If a node is removed from the DOM, the Map still holds a reference,
  // preventing garbage collection.
  const store = new Map<object, Record<string, unknown>>();

  return {
    setMetadata(node: object, key: string, value: unknown): void {
      if (!store.has(node)) {
        store.set(node, {});
      }
      store.get(node)![key] = value;
    },

    getMetadata(node: object, key: string): unknown {
      return store.get(node)?.[key];
    },

    hasMetadata(node: object): boolean {
      return store.has(node);
    },

    // BUG: Exposes count, not possible with WeakMap
    get count(): number {
      return store.size;
    },
  };
}

/**
 * Memoizes an expensive function using object keys as cache keys.
 * When the key object is garbage-collected, the memoized result
 * should also be freed.
 *
 * BUG: Uses Map instead of WeakMap, so memoized results are never freed.
 */
export function memoizeByObject<K extends object, V>(
  fn: (key: K) => V
): (key: K) => V {
  // BUG: Strong reference Map prevents garbage collection
  const memo = new Map<K, V>();

  return (key: K): V => {
    if (memo.has(key)) {
      return memo.get(key)!;
    }
    const result = fn(key);
    memo.set(key, result);
    return result;
  };
}
