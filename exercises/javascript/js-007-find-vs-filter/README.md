# find() vs filter()[0]

**ID:** `js-007-find-vs-filter`
**Difficulty:** ★★☆☆☆
**Estimated Time:** 10 minutes
**Tags:** `javascript`, `arrays`, `find`, `filter`, `some`, `performance`
**Prerequisites:** None

---

## The Scenario

Your user management module has several lookup functions. Code review flagged two issues: the functions that search for a single user use `.filter()[0]`, which iterates the entire array even when a match is found early. And the existence-check functions use `.filter().length > 0`, creating a full intermediate array just to check if it's non-empty. Beyond the performance issue, the "not found" functions return `null` instead of `undefined`, which doesn't match the expected API contract.

## The Bug

The functions use `.filter()[0]` instead of `.find()` for single-item lookups, and `.filter().length > 0` instead of `.some()` for existence checks. This causes:

1. **Wrong return value**: `.filter()[0]` returns `undefined` when not found, but the `?? null` converts it to `null` — callers expect `undefined`
2. **Performance**: `.filter()` always iterates the entire array. `.find()` and `.some()` stop at the first match (short-circuit)
3. **Semantic clarity**: `.find()` and `.some()` communicate intent better than the `.filter()` workarounds

## Your Task

1. Fix `findUserByEmail` to use the correct array method and return `undefined` (not `null`) when not found
2. Fix `hasAdminUser` to use a more appropriate array method
3. Fix `findActiveUserByRole` similarly
4. Fix `hasUsersFromDomain` similarly
5. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/utils.ts` | Functions using filter() where find()/some() should be used |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [MDN: Array.prototype.find()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find) — returns first match or undefined
- [MDN: Array.prototype.some()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some) — returns true if any element matches
- [MDN: Array.prototype.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) — returns all matches
