# The Filter Boolean Trap

**ID:** `js-001-filter-boolean-trap`
**Difficulty:** ★★☆☆☆
**Estimated Time:** 10 minutes
**Tags:** `javascript`, `arrays`, `filter`, `boolean-coercion`, `falsy-values`
**Prerequisites:** None

---

## The Scenario

Your team's grade-tracking application has a bug report: students who scored exactly zero on an exam are disappearing from the results. The dashboard shows they never took the test at all, when in reality they scored 0. A similar issue affects the user profile service — users who set their display name to an empty string are being treated as if they have no name. And in the feature flag system, flags explicitly set to `false` are being dropped entirely.

All three issues trace back to the same pattern in the utility functions that clean up arrays.

## The Bug

The utility functions use `.filter(Boolean)` to remove "empty" values (`null` and `undefined`) from arrays. While this looks clean and idiomatic, `Boolean` coerces values to `true`/`false` — and JavaScript has several falsy values beyond just `null` and `undefined`. The value `0`, the empty string `""`, and `false` are all falsy, so `.filter(Boolean)` removes them too.

## Your Task

1. Fix `getValidScores` so that `0` scores are preserved
2. Fix `getDisplayNames` so that empty strings `""` are preserved
3. Fix `getFeatureFlags` so that `false` values are preserved
4. All three functions should still remove `null` and `undefined`
5. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/utils.ts` | Buggy utility functions that incorrectly filter out falsy values |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [MDN: Array.prototype.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) — how the callback determines which elements to keep
- [MDN: Falsy values](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) — the complete list of falsy values in JavaScript
- [MDN: Boolean()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) — how Boolean coercion works
