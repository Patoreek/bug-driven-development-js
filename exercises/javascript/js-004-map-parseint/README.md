# The map(parseInt) Puzzle

**ID:** `js-004-map-parseint`
**Difficulty:** ★★☆☆☆
**Estimated Time:** 10 minutes
**Tags:** `javascript`, `arrays`, `map`, `parseInt`, `radix`, `callback-arguments`
**Prerequisites:** None

---

## The Scenario

Your team's data import pipeline reads CSV scores as strings and needs to convert them to numbers. A developer writes a clean one-liner: `scores.map(parseInt)`. It works in unit tests with small arrays like `["85"]`, but QA reports that many scores show up as `NaN` in the dashboard. The first score is always correct, but subsequent ones are often wrong or missing entirely.

A similar pattern appears in the CSS utility that extracts numeric values from pixel strings like `"16px"`.

## The Bug

Passing `parseInt` directly to `.map()` causes unexpected behavior. `Array.map` calls its callback with three arguments: `(element, index, array)`. `parseInt` accepts two arguments: `(string, radix)`. So the array index gets interpreted as the radix (number base), causing incorrect parsing or `NaN`.

For example, `["1", "2", "3"].map(parseInt)` actually calls:
- `parseInt("1", 0)` => `1` (radix 0 is treated as base 10)
- `parseInt("2", 1)` => `NaN` (base 1 doesn't exist)
- `parseInt("3", 2)` => `NaN` (3 is not valid in binary)

## Your Task

1. Fix `parseScores` so all string numbers are correctly parsed to integers
2. Fix `parsePixelValues` so pixel strings like `"16px"` are correctly parsed
3. Verify `parseFloats` works correctly (it may or may not have the same issue)
4. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/utils.ts` | Buggy parsing functions using map with parseInt |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [MDN: Array.prototype.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) — callback signature `(element, index, array)`
- [MDN: parseInt()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt) — the radix parameter
