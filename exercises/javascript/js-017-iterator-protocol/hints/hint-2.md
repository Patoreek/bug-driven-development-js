# Hint 2 -- Medium

The **iterable protocol** requires a method keyed with `Symbol.iterator` (not a string method named `iterator`). This method must return an **iterator** -- an object with a `next()` method.

The **iterator protocol** requires that `next()` returns objects of the shape `{ value: T, done: boolean }`:
- `{ value: someValue, done: false }` for each produced value
- `{ value: undefined, done: true }` to signal the end

Three specific issues:
1. `Range` uses `iterator()` instead of `[Symbol.iterator]()`
2. `LinkedList` returns `{ val, done }` -- the property must be named `value`, not `val`
3. `InfiniteSequence` returns `this` from `[Symbol.iterator]()`, so it can only be iterated once. Each call should create a fresh iterator starting from the seed.
