# Hint 2

The issue is with JavaScript's **falsy values**. The values `0`, `""`, and `false` are all falsy, so `.filter(Boolean)` removes them along with `null` and `undefined`. You need a more specific predicate that only removes `null` and `undefined`.
