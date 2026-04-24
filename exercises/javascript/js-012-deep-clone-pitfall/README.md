# Shallow Clone Surprise

**ID:** `js-012-deep-clone-pitfall`
**Difficulty:** ★★★☆☆
**Estimated Time:** 15 minutes
**Tags:** `javascript`, `objects`, `cloning`, `references`, `structuredClone`
**Prerequisites:** None

---

## The Scenario

Your team has a configuration system where each environment (dev, staging, prod) starts as a copy of the base config and then overrides specific settings. A developer used the spread operator to "clone" the base config before modifying it. But changes to the staging config are mysteriously showing up in the prod config. Users are seeing debug logs in production.

## The Bug

The spread operator (`{...obj}`) and `Object.assign` only perform a **shallow** clone. Top-level properties are copied, but nested objects are still shared references. When you modify a nested property on the "clone," you're also modifying the original (and any other shallow clones).

## Your Task

1. Fix `cloneConfig` to perform a deep clone
2. Fix `updateNestedSetting` to update a nested path without mutating the original config
3. Ensure all tests pass
4. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/utils.ts` | Buggy cloning and update functions |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [MDN: structuredClone()](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone) -- deep cloning API
- [MDN: Spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) -- shallow copy behavior
- [MDN: Object.assign()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) -- shallow copy behavior
