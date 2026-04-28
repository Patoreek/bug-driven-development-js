# Iterator Protocol

**ID:** `js-017-iterator-protocol`
**Difficulty:** ★★★★☆
**Estimated Time:** 25 minutes
**Tags:** `javascript`, `iterators`, `symbol-iterator`, `iteration-protocol`, `for-of`
**Prerequisites:** None

---

## The Scenario

Your team is building a data structures library with custom collections -- ranges, linked lists, and infinite sequences. Each collection should work seamlessly with `for...of` loops, the spread operator, destructuring, and `Array.from()`. A teammate implemented the iteration support, but none of the collections actually work with `for...of`. The spread operator throws errors, and when one collection does partially work, iterating it a second time produces stale results.

## The Bug

Multiple issues across three classes:

1. **Range**: Uses a regular method named `iterator()` instead of `[Symbol.iterator]()`, so `for...of` cannot find it. The `next()` method also returns raw values instead of `{ value, done }` objects.
2. **LinkedList**: The `[Symbol.iterator]()` method exists, but its `next()` returns `{ val, done }` (wrong property name) and omits the `value` property on the terminal result.
3. **InfiniteSequence**: Returns `this` from `[Symbol.iterator]()`, making the sequence single-use. After partial iteration, the internal state is advanced and never resets.

## Your Task

1. Fix `Range` to use `[Symbol.iterator]()` and return proper `{ value, done }` objects
2. Fix `LinkedList` to return `{ value, done }` (not `{ val, done }`) from its iterator
3. Fix `InfiniteSequence` to return a **new iterator** from each `[Symbol.iterator]()` call so it can be re-iterated
4. Ensure all tests pass
5. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/utils.ts` | Buggy iterator implementations for Range, LinkedList, InfiniteSequence |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [MDN: Iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) -- iterable and iterator protocols
- [MDN: Symbol.iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator) -- making objects iterable
- [MDN: for...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of) -- consuming iterables
