# Explanation: Mock Leak Between Tests

## Why the Tests Were Flawed

The original test file mocked `globalThis.fetch` once at the **module scope** (outside any `describe` or `beforeEach` block). This single mock was shared by every test in the suite, and its state was never reset between tests. This created **test pollution** -- each test's behavior depended on what previous tests had done to the mock.

## What Was Wrong

```ts
// BEFORE: Module-level mock, never cleaned up
globalThis.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ id: "notif-123" }),
});

describe("NotificationService", () => {
  it("should handle send failure", async () => {
    // Re-assigning fetch but the damage is done --
    // previous test's mock state still lingers
    globalThis.fetch = vi.fn().mockResolvedValueOnce({ ... });
  });
});
```

Problems:
1. **Module-scope mock** -- set once, used everywhere, never cleaned up
2. **No `beforeEach`/`afterEach`** -- no lifecycle hooks to ensure clean state
3. **Mock state accumulates** -- `mockResolvedValueOnce` queue may still have entries from prior tests
4. **Order dependency** -- rearranging tests changes which ones pass or fail
5. **Original `fetch` lost** -- the real `globalThis.fetch` is overwritten and never restored

## The Fix

```ts
// AFTER: Fresh mock per test, proper cleanup
describe("NotificationService", () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn();  // Fresh mock each time
  });

  afterEach(() => {
    vi.restoreAllMocks();  // Clean up everything
  });

  it("should send a notification successfully", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: "notif-123" }),
    } as Response);
    // Each test configures exactly the mock behavior it needs
  });
});
```

Key improvements:
- **`beforeEach`** creates a fresh `vi.fn()` for every test
- **`afterEach`** with `vi.restoreAllMocks()` ensures complete cleanup
- **`mockResolvedValueOnce`** in each test -- specific mock for specific test
- **Tests are order-independent** -- each one sets up its own mock state

## The Rule

**Each test should be completely independent.** It should not matter what order tests run in, or whether other tests exist at all. If removing or reordering a test causes other tests to fail, you have test pollution.

## Interview Context

Mock management is a common interview topic. You might be asked:
- "What's the difference between `vi.fn()`, `vi.spyOn()`, `vi.mock()`, and `vi.restoreAllMocks()`?"
- "How do you ensure test isolation when mocking global objects?"
- "Why might tests pass individually but fail when run together?"

The answer centers on **mock lifecycle management**: create mocks in `beforeEach`, clean them in `afterEach`, and never rely on module-scope mock state.
