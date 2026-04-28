# Explanation: Generator Pagination

## Why the Bug Happens

### Bug 1: `yield` vs `yield*`

```typescript
// Before (buggy) -- yields the entire array as one value
yield page.items;
// Consumer receives: [1, 2, 3] (one iteration step)

// After (fixed) -- delegates to the array's iterator
yield* page.items;
// Consumer receives: 1, then 2, then 3 (three iteration steps)
```

`yield` produces a single value. `yield*` delegates to another iterable (arrays are iterable), yielding each of its elements in sequence. This is the "spread" equivalent for generators.

### Bug 2: Infinite loop

```typescript
// Before (buggy) -- never exits
do { ... } while (true);

// After (fixed) -- exits when API signals no more pages
do { ... } while (cursor !== null);
```

The API signals the last page by returning `nextCursor: null`. The loop must check this to know when to stop. Without the check, the generator calls `fetchPage` forever, even after all data has been retrieved.

### Bug 3: Off-by-one and missing cleanup

```typescript
// Before (buggy) -- takes n+1 items, no cleanup
for (let i = 0; i <= n; i++) { ... }

// After (fixed) -- takes exactly n items, then cleans up
for (let i = 0; i < n; i++) { ... }
await iterator.return?.(undefined);
```

`i <= n` with `i` starting at 0 runs `n+1` iterations. The classic off-by-one fix is `i < n`.

Calling `iterator.return()` is critical for resource management. When you stop consuming a generator early (before it returns on its own), the generator is left suspended at its last `yield`. Any cleanup code after the yield (including `finally` blocks) never runs. `iterator.return()` forces the generator to execute its cleanup path.

### Bug 4: Missing `await` before `yield`

```typescript
// Before (buggy) -- yields the Promise, not its resolved value
yield mapFn(item);

// After (fixed) -- awaits the Promise, yields the resolved value
yield await mapFn(item);
```

In an `async function*`, `yield` does not automatically await a Promise. If `mapFn` returns a Promise, `yield promise` sends the Promise object to the consumer. `yield await promise` resolves it first.

## yield vs yield*

| Expression | What it does |
|-----------|--------------|
| `yield x` | Produces `x` as a single value |
| `yield* iterable` | Delegates to `iterable`, yielding each element |
| `yield* [1,2,3]` | Same as `yield 1; yield 2; yield 3;` |
| `yield* otherGenerator()` | Delegates to another generator |

## Generator Cleanup Pattern

Always clean up generators you consume partially:

```typescript
const iter = asyncGen[Symbol.asyncIterator]();
try {
  // consume some items...
} finally {
  await iter.return?.(undefined);
}
```

`for...of` and `for await...of` handle this automatically when you `break` out of the loop. Manual iteration with `.next()` requires explicit cleanup.

## Common Variations

1. **Cursor vs offset pagination**: Same generator pattern works with offset-based APIs (`?page=2`) -- just change the cursor to a page number
2. **Rate limiting**: Add `await delay(ms)` between page fetches inside the generator
3. **Error retry**: Wrap `fetchPage` in a retry loop inside the generator -- consumers are unaware of retries

## Interview Context

Async generator questions test understanding of:
- The difference between `yield` and `yield*` (delegation)
- Lazy evaluation and backpressure in data pipelines
- Resource cleanup with `iterator.return()`
- The interaction between `async`, `yield`, and `await`
- Practical pagination patterns in real APIs

## References

- [MDN: async function*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function*)
- [MDN: yield*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/yield*)
- [MDN: for await...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of)
- [MDN: Generator.prototype.return()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator/return)
