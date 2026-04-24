# Explanation: The map(parseInt) Puzzle

## Why the Bug Happens

This is one of JavaScript's most famous gotchas. It comes down to how `.map()` calls its callback and how `parseInt` uses its parameters.

### `.map()` passes three arguments:

```ts
array.map((element, index, array) => ...)
```

### `parseInt` accepts two arguments:

```ts
parseInt(string, radix)
```

When you write `strings.map(parseInt)`, the index gets passed as the radix:

| Call | string | radix (index) | Result |
|------|--------|---------------|--------|
| `parseInt("1", 0)` | "1" | 0 | `1` (radix 0 treated as 10) |
| `parseInt("2", 1)` | "2" | 1 | `NaN` (no base-1 system) |
| `parseInt("3", 2)` | "3" | 2 | `NaN` ("3" invalid in binary) |
| `parseInt("10", 3)` | "10" | 3 | `3` (base 3: "10" = 3) |

### Why `parseFloat` is unaffected

`parseFloat` only accepts **one** argument — it ignores extra arguments. So `strings.map(parseFloat)` works fine because the index and array arguments are simply ignored. However, wrapping it in an arrow function is still clearer and more intentional.

## The Fix

Wrap `parseInt` in an arrow function so only the string is passed:

### Before (buggy):
```ts
return stringScores.map(parseInt);
```

### After (fixed):
```ts
return stringScores.map((s) => parseInt(s, 10));
```

Always specify the radix (`10` for decimal) to be explicit and avoid edge cases.

Alternative: use `Number()` for simple numeric strings:
```ts
return stringScores.map(Number);
```

`Number` only takes one argument, so it works safely with `.map()`. However, `Number("16px")` returns `NaN`, while `parseInt("16px", 10)` returns `16` — so `parseInt` is needed for pixel values.

## Common Variations

- **`strings.map(Number)`**: Works for clean strings but fails for `"16px"`, `"3.14em"`, etc.
- **`strings.map(Boolean)`**: Similar pattern — but `Boolean` only takes one argument, so it's actually safe
- **Any multi-parameter function passed to `.map()`**: e.g., `urls.map(fetch)` could have similar issues

## Interview Context

This is a classic JavaScript interview question because it tests:
1. Understanding of how `.map()` invokes its callback
2. Knowledge of `parseInt`'s radix parameter
3. The general principle of **implicit argument passing** — knowing what arguments a function receives when you pass it as a callback
4. Best practice: always specify the radix in `parseInt`

## References

- [MDN: parseInt()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt)
- [MDN: Array.prototype.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
