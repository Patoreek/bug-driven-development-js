# Fix the Over-Mocked Test

**ID:** `test-005-mock-implementation`  
**Difficulty:** ★★★☆☆  
**Estimated Time:** 20 minutes  
**Tags:** `testing`, `vitest`, `mocking`, `test-design`  
**Prerequisites:** None

---

## The Scenario

Your team has a `PricingCalculator` module that computes order totals with tiered pricing, discounts, and tax. A previous developer wrote tests that mock the internal helper functions (`getTier`, `applyDiscount`, `calculateTax`) and then call `calculateOrder`. The tests all pass, but during a code review you notice a bug in the discount calculation -- and the tests didn't catch it. On closer inspection, the tests are verifying the mock's return values, not the real business logic. The entire pricing engine could be broken and these tests would still be green.

## The Problem

The tests use `vi.mock` to replace internal functions with mocks that return hardcoded values. When `calculateOrder` calls `getTier`, it gets the mock's response -- not the real tier lookup. The assertions then check values that come straight from the mock, creating a circular test: mock returns X, test asserts X. This tests nothing about the actual implementation.

## Your Task

1. Fix the test file at `src/__tests__/PricingCalculator.test.ts`
2. Do NOT modify the application code in `src/`
3. Remove the `vi.mock` of the module's own functions
4. Test the real behavior by calling functions and asserting on actual computed results
5. All tests should pass AND meaningfully verify the pricing logic

## Files to Modify

| File | Description |
|------|-------------|
| `src/__tests__/PricingCalculator.test.ts` | The over-mocked test file |

## Files to Read (don't modify)

| File | Description |
|------|-------------|
| `src/PricingCalculator.ts` | The correct pricing calculator module |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Vitest Mocking](https://vitest.dev/guide/mocking.html) -- when to mock and when not to
- [Testing Implementation Details](https://kentcdodds.com/blog/testing-implementation-details) -- why testing internals is fragile
- [Mock boundaries](https://martinfowler.com/articles/mocksArentStubs.html) -- mock at the boundary, not inside
