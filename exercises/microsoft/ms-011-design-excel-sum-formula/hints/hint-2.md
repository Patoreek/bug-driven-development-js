# Hint 2: Storage strategy

You need a separate `Map<string, string[]>` to store formulas, keyed by cell position (e.g., `"row,col"`), with the value being the original range strings passed to `sum()`.

Three things must happen:
1. `sum()` stores the formula AND computes the initial value
2. `get()` checks if the cell has a formula, and if so, **re-evaluates** it
3. `set()` **clears** any formula the cell might have (since you're overwriting it with a constant)

The key insight: formulas are evaluated lazily at `get()` time, not eagerly at `set()` time.
