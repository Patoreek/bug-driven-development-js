# Fix the Snapshot Test

**ID:** `test-006-snapshot-abuse`  
**Difficulty:** ★★★☆☆  
**Estimated Time:** 20 minutes  
**Tags:** `testing`, `vitest`, `snapshots`, `react-testing-library`  
**Prerequisites:** None

---

## The Scenario

Your team's `ProductCard` component has a test file that uses snapshot tests for everything. Every time someone changes a class name, adds a wrapper `<div>`, or adjusts whitespace, the snapshots break. The team's habit has become to run `vitest -u` to update all snapshots without reviewing the diff. Last week, a bug slipped through where the "Add to Cart" button was accidentally removed -- the snapshot was auto-updated and nobody noticed until it reached production. Your manager asks you to replace the snapshots with targeted assertions that test actual behavior.

## The Problem

The tests use `toMatchSnapshot()` on `container.innerHTML`, capturing the entire HTML output of the component. These massive snapshots:
- Break on any markup change, even non-functional ones
- Don't communicate what behavior is being tested
- Get auto-updated without review, hiding real regressions
- Test everything and nothing at the same time

## Your Task

1. Fix the test file at `src/__tests__/ProductCard.test.tsx`
2. Do NOT modify the application code in `src/`
3. Replace all `toMatchSnapshot()` calls with specific assertions about behavior
4. Test each piece of functionality (name, price, stock status, rating, button behavior) individually
5. All tests should pass AND meaningfully verify behavior

## Files to Modify

| File | Description |
|------|-------------|
| `src/__tests__/ProductCard.test.tsx` | The snapshot-heavy test file |

## Files to Read (don't modify)

| File | Description |
|------|-------------|
| `src/ProductCard.tsx` | The correct ProductCard component |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Vitest Snapshot Testing](https://vitest.dev/guide/snapshot.html) -- when snapshots are appropriate
- [Effective Snapshot Testing](https://kentcdodds.com/blog/effective-snapshot-testing) -- best practices
- [RTL Queries](https://testing-library.com/docs/queries/about) -- targeted element queries
