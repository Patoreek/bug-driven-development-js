# Explanation: Promise.all Loses Everything on One Failure

## Why the Bug Happens

`Promise.all()` has **all-or-nothing** semantics. It returns a single promise that:
- **Fulfills** when *all* input promises fulfill (with an array of all results)
- **Rejects** when *any* input promise rejects (with the first rejection reason)

The critical problem: when it rejects, you get **zero** results. Even if 99 out of 100 promises succeeded, you lose all 99 successful results because of 1 failure.

```typescript
// Buggy: one bad apple spoils the bunch
const users = await Promise.all(ids.map(id => fetchUser(id)));
// If ANY fetchUser rejects, this throws and users is never assigned
```

## The Fix

Use `Promise.allSettled()` instead. It **never rejects** -- it always returns an array of settlement objects, one per input promise:

```typescript
// Fixed: every promise gets a result
const settlements = await Promise.allSettled(ids.map(id => fetchUser(id)));

settlements.forEach((settlement, index) => {
  if (settlement.status === "fulfilled") {
    succeeded.push(settlement.value);
  } else {
    failed.push({
      id: ids[index],
      error: settlement.reason?.message || String(settlement.reason),
    });
  }
});
```

Each settlement object has:
- `status`: `"fulfilled"` or `"rejected"`
- `value`: the result (only if fulfilled)
- `reason`: the error (only if rejected)

## When to Use Which

| Method | Use When |
|--------|----------|
| `Promise.all` | All promises must succeed (e.g., loading critical config) |
| `Promise.allSettled` | You want partial results (e.g., batch operations, dashboards) |
| `Promise.race` | You want the first to settle (e.g., timeout patterns) |
| `Promise.any` | You want the first to succeed (e.g., fastest mirror) |

## Common Variations

1. **Wrapping individual promises in try/catch**: Another approach is to catch each promise individually before passing to `Promise.all`:
   ```typescript
   const results = await Promise.all(
     ids.map(id => fetchUser(id).catch(err => ({ error: err })))
   );
   ```
   This works but `allSettled` is cleaner and more explicit.

2. **Not checking `settlement.status`**: Forgetting to distinguish between fulfilled and rejected results.

3. **Using `Promise.all` with a global try/catch**: This catches the error but you still lose all the successful results.

## Interview Context

This is a very common interview question, especially for senior roles. Interviewers look for:
- Understanding the difference between `Promise.all` and `Promise.allSettled`
- Ability to design resilient async operations that handle partial failures gracefully
- Knowledge of when all-or-nothing semantics are appropriate vs. when partial results matter

## References

- [MDN: Promise.all()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
- [MDN: Promise.allSettled()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)
- [MDN: Promise.race()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race)
- [MDN: Promise.any()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/any)
