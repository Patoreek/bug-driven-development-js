/**
 * A cache that stores computed results keyed by object references.
 * Uses a WeakMap so that when the key object is no longer referenced
 * anywhere else, the cached entry can be garbage-collected.
 */

export interface CacheEntry<T> {
  value: T;
  createdAt: number;
}

/**
 * Creates an object cache that allows garbage collection of
 * entries whose keys are no longer referenced elsewhere.
 *
 * FIX: Uses WeakMap instead of Map, and removes size/entries
 * methods that are incompatible with WeakMap.
 */
export function createObjectCache<T>() {
  // FIX: WeakMap allows garbage collection of key objects
  const cache = new WeakMap<object, CacheEntry<T>>();

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

    // FIX: Removed `size` property -- WeakMap has no size because
    // entries can be garbage-collected at any time.

    // FIX: Removed `entries()` method -- WeakMap is not iterable
    // because its entries can disappear at any time.

    delete(key: object): boolean {
      return cache.delete(key);
    },
  };
}

/**
 * Attaches private metadata to DOM-like node objects.
 * The metadata does not prevent the node from being garbage-collected.
 *
 * FIX: Uses WeakMap so that when a node is removed from the DOM
 * and no other references exist, it can be garbage-collected.
 */
export function createNodeMetadataStore() {
  // FIX: WeakMap allows nodes to be garbage-collected
  const store = new WeakMap<object, Record<string, unknown>>();

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

    // FIX: Removed `count` property -- WeakMap has no size.
  };
}

/**
 * Memoizes an expensive function using object keys as cache keys.
 * When the key object is garbage-collected, the memoized result
 * is also freed.
 *
 * FIX: Uses WeakMap so memoized results are freed when keys are GC'd.
 */
export function memoizeByObject<K extends object, V>(
  fn: (key: K) => V
): (key: K) => V {
  // FIX: WeakMap allows garbage collection of memoized entries
  const memo = new WeakMap<K, V>();

  return (key: K): V => {
    if (memo.has(key)) {
      return memo.get(key)!;
    }
    const result = fn(key);
    memo.set(key, result);
    return result;
  };
}
