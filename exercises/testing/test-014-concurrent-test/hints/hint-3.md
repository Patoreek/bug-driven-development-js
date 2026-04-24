# Hint 3 -- Strong

Here's the key pattern for each area:

**Rate limiter with fake timers:**
```typescript
it("should reset after the time window", () => {
  limiter.call();
  limiter.call();
  limiter.call();
  expect(limiter.call()).toBe(false);

  vi.advanceTimersByTime(1000); // Exact window

  expect(limiter.call()).toBe(true); // Deterministic!
});
```

**Time-until-reset is now exact:**
```typescript
limiter.call();
vi.advanceTimersByTime(200);
expect(limiter.getTimeUntilReset()).toBe(800); // 1000 - 200, no fuzzy range
```

**AsyncQueue with `advanceTimersByTimeAsync`:**
```typescript
const p1 = queue.add(task("a", 100));
const p2 = queue.add(task("b", 50));
const p3 = queue.add(task("c", 50));

// Synchronously: a and b start
expect(order).toEqual(["start-a", "start-b"]);

// Advance 50ms: b finishes, c starts
await vi.advanceTimersByTimeAsync(50);
expect(order).toContain("end-b");
expect(order).toContain("start-c");

// Advance another 50ms: a and c finish
await vi.advanceTimersByTimeAsync(50);
await Promise.all([p1, p2, p3]);
```

For pending/active counts, use `await vi.advanceTimersByTimeAsync(0)` to flush microtasks without advancing time.
