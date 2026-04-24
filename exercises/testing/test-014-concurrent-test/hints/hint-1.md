# Hint 1 -- Mild

There are two separate problems causing flakiness:

1. **Shared state**: The `limiter` and `queue` variables are declared once at the top and reused across all tests. Each test should create its own instance.

2. **Real time**: `RateLimiter` uses `Date.now()` and the tests use real `setTimeout`. Vitest's fake timers can mock both, giving you precise control over "what time it is."

Start by moving instance creation into `beforeEach` and adding `vi.useFakeTimers()`.
