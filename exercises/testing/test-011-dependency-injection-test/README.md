# Fix the Dependency Injection Tests

**ID:** `test-011-dependency-injection-test`
**Difficulty:** ★★★★☆
**Estimated Time:** 25 minutes
**Tags:** `testing`, `vitest`, `dependency-injection`, `mocking`, `unit-testing`
**Prerequisites:** None

---

## The Scenario

Your team's `OrderService` is a critical piece of the e-commerce backend. It coordinates product lookups, stock validation, payment processing, and order creation through an injected `HttpClient` and `Logger`. A previous developer wrote the tests using "realistic" fake implementations -- a `RealHttpClient` class that simulates network latency with random delays, and a `RealLogger` that writes to `console.log`. The tests are slow (10+ second timeouts), flaky (payments randomly fail), and share mutable state across tests. CI is red more often than green.

## The Problem

The tests have multiple interrelated issues:

1. **No mock injection**: Instead of injecting mock objects via the constructor, tests use concrete `RealHttpClient` and `RealLogger` classes with real-ish behavior
2. **Random behavior**: The fake HTTP client adds `100-300ms` random delays and the payment endpoint randomly fails ~10% of the time
3. **Shared mutable state**: A single `httpClient` and `logger` instance is shared across all tests, so one test's side effects leak into the next
4. **Untestable paths**: To test payment failure, the test retries up to 50 times hoping for a random failure
5. **Weak assertions**: Tests verify that "something happened" rather than asserting specific interactions

## Your Task

1. Fix the test file at `src/__tests__/OrderService.test.ts`
2. Do NOT modify the application code in `src/OrderService.ts`
3. Remove the `RealHttpClient` and `RealLogger` classes entirely
4. Create mock objects using `vi.fn()` and inject them via the `OrderService` constructor
5. Each test should create fresh mocks (use `beforeEach` or per-test factories)
6. Assert specific mock interactions: which URLs were called, with what arguments
7. Test all paths deterministically: success, insufficient stock, payment failure, cancellation

## Files to Modify

| File | Description |
|------|-------------|
| `src/__tests__/OrderService.test.ts` | Tests using real dependencies instead of injected mocks |

## Files to Read (don't modify)

| File | Description |
|------|-------------|
| `src/OrderService.ts` | The correct OrderService with HttpClient and Logger interfaces |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Vitest Mock Functions](https://vitest.dev/api/mock.html) -- `vi.fn()`, `mockResolvedValue`, `mockRejectedValue`
- [Dependency Injection](https://en.wikipedia.org/wiki/Dependency_injection) -- passing dependencies via constructor
- [Test Isolation](https://martinfowler.com/articles/nonDeterminism.html) -- why shared state causes flaky tests
