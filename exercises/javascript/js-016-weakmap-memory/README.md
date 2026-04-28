# WeakMap Memory Leak

**ID:** `js-016-weakmap-memory`
**Difficulty:** ★★★★☆
**Estimated Time:** 25 minutes
**Tags:** `javascript`, `weakmap`, `garbage-collection`, `caching`, `memory-leaks`
**Prerequisites:** None

---

## The Scenario

Your team built a caching layer that stores computed results keyed by object references -- for example, caching expensive DOM measurements keyed by the DOM node itself, or memoizing API responses keyed by request configuration objects. In development it worked fine, but production monitoring shows memory usage climbing steadily over time. Nodes removed from the DOM still linger in memory, and the cache grows without bound even though the objects it references are long gone.

## The Bug

The caching utilities use `Map` instead of `WeakMap` to store object-keyed entries. A regular `Map` holds **strong references** to its keys, which prevents the JavaScript engine from garbage-collecting those objects even when nothing else references them. Additionally, the API surface exposes `.size` and `.entries()` methods that are fundamentally incompatible with weak references -- if the cache used `WeakMap`, those methods would be meaningless because entries can vanish at any time.

## Your Task

1. Replace `Map` with `WeakMap` in all three utilities (`createObjectCache`, `createNodeMetadataStore`, `memoizeByObject`)
2. Remove the `size` property and `entries()` method from `createObjectCache` (WeakMap does not support them)
3. Remove the `count` property from `createNodeMetadataStore` (WeakMap does not support it)
4. Ensure all tests pass
5. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/utils.ts` | Buggy caching utilities using Map instead of WeakMap |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [MDN: WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) -- weak key references
- [MDN: Map vs WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap#description) -- when to use which
- [MDN: Memory management](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_management) -- garbage collection basics
