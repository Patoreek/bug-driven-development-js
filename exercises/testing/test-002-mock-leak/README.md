# Mock Leak Between Tests

**ID:** `test-002-mock-leak`  
**Difficulty:** ★★☆☆☆  
**Estimated Time:** 15 minutes  
**Tags:** `testing`, `vitest`, `mocking`, `test-isolation`  
**Prerequisites:** None

---

## The Scenario

Your team's notification service test suite has a strange problem: the tests pass when you run them individually, but fail when you run the entire suite together. A junior developer mocked `fetch` in the first test to simulate a successful notification, but now every subsequent test is still seeing that same mock response -- even tests that expect a different API behavior.

## The Problem

The tests mock `globalThis.fetch` once but never restore or reset it between tests. The first test's mock leaks into every subsequent test. Tests that expect different responses (like an error response) still get the stale success mock from the first test. The test suite is order-dependent and unreliable.

## Your Task

1. Fix the test file at `src/__tests__/NotificationService.test.ts`
2. Do NOT modify the application code in `src/`
3. Ensure mocks are properly cleaned up between tests so each test is isolated
4. All tests should pass AND meaningfully verify behavior

## Files to Modify

| File | Description |
|------|-------------|
| `src/__tests__/NotificationService.test.ts` | The flawed test file with leaking mocks |

## Files to Read (don't modify)

| File | Description |
|------|-------------|
| `src/NotificationService.ts` | The correct notification service |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Vitest Mock Functions](https://vitest.dev/api/vi.html#vi-fn) -- creating and managing mocks
- [Vitest vi.restoreAllMocks](https://vitest.dev/api/vi.html#vi-restoreallmocks) -- restoring original implementations
- [Test Isolation](https://testing-library.com/docs/guide-disappearance/) -- keeping tests independent
