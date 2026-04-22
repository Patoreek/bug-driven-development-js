# Missing Assertions

**ID:** `test-001-missing-assertions`  
**Difficulty:** ★★☆☆☆  
**Estimated Time:** 15 minutes  
**Tags:** `testing`, `vitest`, `assertions`, `react-testing-library`  
**Prerequisites:** None

---

## The Scenario

You've joined a team that prides itself on "100% test coverage." The dashboard shows green across the board, and the CI pipeline always passes. But during a recent refactor, someone accidentally deleted the entire body of the `UserCard` component, replacing it with an empty `<div />`. The tests still passed. Your tech lead asks you to investigate why the test suite failed to catch such an obvious regression.

## The Problem

The current tests render the `UserCard` component and call functions, but they never actually check the output. There are no meaningful assertions -- the tests pass simply because no error is thrown during rendering. This gives a false sense of security: the tests cover the code paths but verify nothing about the component's behavior.

## Your Task

1. Fix the test file at `src/__tests__/UserCard.test.tsx`
2. Do NOT modify the application code in `src/`
3. Add proper assertions that verify the component renders user information correctly
4. All tests should pass AND meaningfully verify behavior

## Files to Modify

| File | Description |
|------|-------------|
| `src/__tests__/UserCard.test.tsx` | The flawed test file -- tests exist but have no assertions |

## Files to Read (don't modify)

| File | Description |
|------|-------------|
| `src/UserCard.tsx` | The correct UserCard component |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Vitest expect API](https://vitest.dev/api/expect.html) -- assertion methods
- [RTL Queries](https://testing-library.com/docs/queries/about) -- finding elements
- [jest-dom matchers](https://github.com/testing-library/jest-dom#custom-matchers) -- DOM-specific assertions like toBeInTheDocument
