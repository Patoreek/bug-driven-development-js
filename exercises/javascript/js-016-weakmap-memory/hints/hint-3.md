# Hint 3 -- Strong

Here are all the fixes:

**Replace Map with WeakMap** in all three utilities:
```typescript
// Before
const cache = new Map<object, CacheEntry<T>>();

// After
const cache = new WeakMap<object, CacheEntry<T>>();
```

**Remove `size` getter and `entries()` method** from `createObjectCache` -- WeakMap does not support them.

**Remove `count` getter** from `createNodeMetadataStore` -- WeakMap does not support it.

**Replace Map with WeakMap** in `memoizeByObject`:
```typescript
// Before
const memo = new Map<K, V>();

// After
const memo = new WeakMap<K, V>();
```

The `.get()`, `.set()`, `.has()`, and `.delete()` methods work identically on both Map and WeakMap, so the rest of the logic stays the same.
