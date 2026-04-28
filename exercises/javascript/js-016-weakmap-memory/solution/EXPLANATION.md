# Explanation: WeakMap Memory Leak

## Why the Bug Happens

The code uses `Map` to cache data keyed by object references. A `Map` holds **strong references** to its keys, meaning the JavaScript engine cannot garbage-collect a key object as long as the `Map` still contains it -- even if nothing else in the application references that object.

This creates a classic **memory leak**: objects that should be freed (removed DOM nodes, discarded request configs, expired session objects) stay alive indefinitely because the cache holds a strong reference.

### The API surface problem

The buggy code also exposes `.size`, `.entries()`, and `.count` -- methods that only work on `Map`. `WeakMap` deliberately omits these because its entries can be garbage-collected at any time, making size and iteration inherently unreliable. Exposing them signals the wrong data structure choice.

## The Fix

### Replace Map with WeakMap

```typescript
// Before (buggy) -- strong references, prevents GC
const cache = new Map<object, CacheEntry<T>>();

// After (fixed) -- weak references, allows GC
const cache = new WeakMap<object, CacheEntry<T>>();
```

### Remove incompatible API methods

```typescript
// Before (buggy) -- these rely on Map's iterability
get size(): number { return cache.size; }
entries(): Array<[object, CacheEntry<T>]> { return Array.from(cache.entries()); }
get count(): number { return store.size; }

// After (fixed) -- removed entirely, WeakMap does not support them
```

### Same pattern in memoizeByObject

```typescript
// Before
const memo = new Map<K, V>();

// After
const memo = new WeakMap<K, V>();
```

## Map vs WeakMap

| Feature | Map | WeakMap |
|---------|-----|---------|
| Key types | Any value | Objects only |
| Key references | Strong | Weak |
| Iterable | Yes | No |
| `.size` | Yes | No |
| GC of keys | Never (while in Map) | When no other refs exist |
| Use case | General key-value store | Object-associated metadata |

## When to Use WeakMap

Use `WeakMap` when:
- Keys are objects whose lifecycle you don't control (DOM nodes, class instances)
- The cached/associated data should not outlive the key
- You don't need to enumerate entries or know the size

Use `Map` when:
- Keys are primitives (strings, numbers)
- You need to iterate, count, or serialize entries
- You explicitly manage the lifecycle (manual `.delete()`)

## Common Variations

1. **DOM metadata storage**: Storing event handlers, computed styles, or component state keyed by DOM nodes. If the node is removed, the metadata leaks.
2. **Request deduplication**: Caching in-flight requests by config object. Old configs pile up if using Map.
3. **Private fields (pre-class fields)**: Before `#private` syntax, WeakMap was the standard pattern for truly private instance data.

## Interview Context

WeakMap questions test understanding of JavaScript's memory model. Interviewers look for:
- Knowing the difference between strong and weak references
- Understanding why WeakMap is not iterable (its entries are non-deterministic)
- Recognizing memory leak patterns in caches and metadata stores
- Awareness that `WeakMap` keys must be objects (not primitives)
- Practical experience choosing Map vs WeakMap for real use cases

## References

- [MDN: WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
- [MDN: Memory management](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_management)
- [MDN: Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
