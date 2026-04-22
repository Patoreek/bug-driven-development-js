# Hint 3 (Strong)

Remove the module-level `globalThis.fetch = vi.fn()...` line. Then add:

```ts
beforeEach(() => {
  globalThis.fetch = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
});
```

Inside each test, configure the mock for that specific scenario:

```ts
it("should send a notification successfully", async () => {
  vi.mocked(globalThis.fetch).mockResolvedValueOnce({
    ok: true,
    json: async () => ({ id: "notif-123" }),
  } as Response);
  // ... rest of test
});
```

Also add proper mock responses for the `getNotifications` and `markAsRead` tests, since they were relying on stale mock data before.
