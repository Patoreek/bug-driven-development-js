# Fix the Test Order Dependency

**ID:** `test-007-shared-state`  
**Difficulty:** ★★★☆☆  
**Estimated Time:** 20 minutes  
**Tags:** `testing`, `vitest`, `test-isolation`, `shared-state`  
**Prerequisites:** None

---

## The Scenario

A colleague wrote tests for the `ShoppingCart` class that pass when run together in order but fail in bizarre ways when you run a single test or when the test runner shuffles execution order. The test for "should start empty" fails intermittently, and "should calculate total for one item" sometimes reports a total of $6.75 instead of $1.50. You realize the tests are building on each other like a story -- each test depends on the state left behind by the previous one.

## The Problem

All tests share a single `ShoppingCart` instance declared at module scope. Each test mutates this shared cart and expects specific accumulated state. This means:
- Tests must run in a specific order to pass
- Running one test in isolation gives unexpected results
- Randomized test ordering (common in CI) causes failures
- Adding or removing a test in the middle can break unrelated tests below it

## Your Task

1. Fix the test file at `src/__tests__/ShoppingCart.test.ts`
2. Do NOT modify the application code in `src/`
3. Make each test independent -- it should set up its own state and not depend on other tests
4. All tests should pass individually AND when run together in any order

## Files to Modify

| File | Description |
|------|-------------|
| `src/__tests__/ShoppingCart.test.ts` | The test file with shared mutable state |

## Files to Read (don't modify)

| File | Description |
|------|-------------|
| `src/ShoppingCart.ts` | The correct ShoppingCart class |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Vitest beforeEach](https://vitest.dev/api/#beforeeach) -- setup that runs before each test
- [Test isolation](https://martinfowler.com/articles/nonDeterminism.html) -- why tests should be independent
- [Arrange-Act-Assert](https://automationpanda.com/2020/07/07/arrange-act-assert-a-pattern-for-writing-good-tests/) -- test structure pattern
