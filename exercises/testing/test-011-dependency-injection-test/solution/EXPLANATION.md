# Explanation: Dependency Injection Tests

## Why the Bug Happens

The original tests violate a fundamental unit testing principle: **test in isolation by controlling dependencies**. Instead of injecting mock objects through the constructor (which `OrderService` explicitly supports), the tests create "realistic" fake implementations with several fatal flaws:

### 1. Non-deterministic behavior

The `RealHttpClient` adds random delays (`100-300ms`) and randomly fails payments (~10% of the time). Tests that depend on random behavior are the definition of flaky -- they pass sometimes and fail sometimes with no code changes.

### 2. Shared mutable state

A single `httpClient` and `logger` instance is shared across all tests. Orders created in one test persist in `this.data` and affect later tests. The logger accumulates logs from every test.

### 3. Untestable error paths

To test payment failure, the original code retries up to 50 times, hoping for a random failure. This is slow, wasteful, and still not guaranteed to work.

### 4. Weak assertions

Tests verify vague things like "log count increased" rather than asserting specific interactions with specific arguments.

## The Fix

### Before (buggy)

```typescript
// Shared concrete instances
const httpClient = new RealHttpClient(); // random delays, random failures
const logger = new RealLogger();         // writes to console

// Tests depend on random behavior
it("should handle payment failure", async () => {
  let failed = false;
  for (let i = 0; i < 50; i++) {
    try { await service.createOrder(...); }
    catch (err) { failed = true; break; }
  }
  expect(failed).toBe(true);
}, 60000);
```

### After (fixed)

```typescript
// Fresh mocks per test
beforeEach(() => {
  httpClient = { get: vi.fn(), post: vi.fn() };
  logger = { info: vi.fn(), error: vi.fn(), warn: vi.fn() };
  service = new OrderService(httpClient, logger);
});

// Deterministic, fast, specific
it("should handle payment failure", async () => {
  vi.mocked(httpClient.get).mockResolvedValueOnce(sampleProduct);
  vi.mocked(httpClient.post).mockResolvedValueOnce({
    success: false, error: "Card declined"
  });

  await expect(service.createOrder(...)).rejects.toThrow("Payment failed: Card declined");
  expect(logger.error).toHaveBeenCalledWith("Payment failed", { error: "Card declined" });
});
```

## Key Principles

1. **Inject, don't construct**: If a class accepts dependencies via constructor, use that seam for testing
2. **Fresh mocks per test**: Use `beforeEach` to create new mock instances so tests can't leak state
3. **Control responses precisely**: `mockResolvedValueOnce` lets you script exactly what each call returns
4. **Assert interactions**: Verify the right URLs were called with the right arguments
5. **No timeouts needed**: Mock objects resolve instantly -- no `setTimeout`, no 10-second timeouts

## Common Variations

1. **Module-level singletons**: When dependencies are imported singletons rather than injected, you need `vi.mock()` at the module level
2. **Partial mocking**: Sometimes you want most methods to be mocks but one to be real -- use `vi.fn().mockImplementation()`
3. **Spy vs mock**: `vi.spyOn()` wraps a real implementation and lets you assert on calls while keeping the real behavior

## Interview Context

Dependency injection testing is a core senior engineering skill. Interviewers look for:
- Understanding of why shared state causes flaky tests
- Ability to identify the correct "seam" or boundary to mock at
- Knowledge of the Arrange-Act-Assert pattern
- Understanding that mocks should be scoped to the test, not shared globally
- Awareness that non-determinism (random, time-based) must be controlled

## References

- [Vitest Mock Functions](https://vitest.dev/api/mock.html)
- [Martin Fowler: Test Doubles](https://martinfowler.com/bliki/TestDouble.html)
- [Eradicating Non-Determinism in Tests](https://martinfowler.com/articles/nonDeterminism.html)
