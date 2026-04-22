# Solution: E2E Test Flakiness

## The Bug

The tests used timing-dependent patterns that work inconsistently:

1. **Hardcoded `sleep()` delays:** `await sleep(100)` assumes the async operation completes within 100ms. On slow CI runners, it might take 200ms.

2. **`getByTestId` for async content:** This query throws immediately if the element isn't in the DOM. For content that appears after an API call, you need a query that waits.

3. **Missing waits after interactions:** After clicking "Mark as read", the test checks the DOM before the async `markAsRead()` API call completes.

## The Fix

1. **Replace `sleep()` + `getByTestId` with `findByTestId`:**
```tsx
// Before (flaky)
await sleep(100);
expect(screen.getByTestId("notification-list")).toBeInTheDocument();

// After (stable)
expect(await screen.findByTestId("notification-list")).toBeInTheDocument();
```

2. **Use `waitFor` for state changes after interactions:**
```tsx
// Before (flaky)
await sleep(50);
expect(screen.queryByTestId("mark-read-n1")).not.toBeInTheDocument();

// After (stable)
await waitFor(() => {
  expect(screen.queryByTestId("mark-read-n1")).not.toBeInTheDocument();
});
```

3. **Remove all `sleep()` calls and `act()` wrappers** -- `findBy` and `waitFor` handle timing internally.

## Key Takeaway

Never use hardcoded delays in tests. Use `findBy*` queries (which return promises and retry automatically) for elements that appear asynchronously, and `waitFor` for assertions that need to wait for state changes. This makes tests deterministic regardless of machine speed.
