# E2E Test Flakiness: Timing-Dependent Assertions

**ID:** `fs-010-e2e-test-flakiness`  
**Difficulty:** ★★★★☆  
**Estimated Time:** 25 minutes  
**Tags:** `testing`, `async`, `flaky-tests`, `waitFor`, `findBy`  
**Prerequisites:** None

---

## The Scenario

Your team has a notification list component that fetches data from an API and displays it. The test suite for this component passes 70% of the time and fails 30% of the time. The CI pipeline is unreliable. Developers have started re-running failed pipelines instead of fixing the tests. You've been asked to fix the flaky tests.

## The Bug

The tests use hardcoded `setTimeout` delays, check for elements too early (before async operations complete), and use `getBy` queries for elements that appear asynchronously. These timing-dependent assertions pass on fast machines but fail on slow CI runners or under load.

## Your Task

1. Examine `src/__tests__/NotificationList.test.tsx` and identify flaky patterns
2. Replace hardcoded delays with proper `waitFor` or `findBy` queries
3. Use `screen.findByTestId` instead of `screen.getByTestId` for async content
4. Ensure tests pass reliably, not just sometimes
5. The component file (`src/NotificationList.tsx`) is correct -- only fix the tests
6. Do NOT modify the component file

## Files to Modify

| File | Description |
|------|-------------|
| `src/__tests__/NotificationList.test.tsx` | Flaky test suite with timing issues |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Async Testing](https://testing-library.com/docs/dom-testing-library/api-async/) -- waitFor and findBy queries
- [Common Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library) -- testing library anti-patterns
- [Avoiding Flaky Tests](https://testing-library.com/docs/guide-disappearance) -- waiting for disappearance
