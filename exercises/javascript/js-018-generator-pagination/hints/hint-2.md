# Hint 2 -- Medium

Four issues:

1. **`yield` vs `yield*`**: `yield arr` produces the array as a single value. `yield* arr` delegates to the array's iterator, yielding each element one at a time. This is the difference between getting `[1, 2, 3]` once vs getting `1`, then `2`, then `3`.

2. **Infinite loop**: The `do...while(true)` never exits. Check `cursor` (which is set to `page.nextCursor`) -- when it's `null`, there are no more pages.

3. **Off-by-one in `takeAsync`**: `for (let i = 0; i <= n; i++)` runs `n+1` times. Use `<` for exactly `n` iterations. Also, call `iterator.return()` when you're done to let the generator clean up.

4. **Missing `await` in `mapAsync`**: If `mapFn` returns a Promise, `yield mapFn(item)` yields the Promise object. Use `yield await mapFn(item)` to resolve it first.
