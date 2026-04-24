# Hint 3 (Strong)

Every fetch call needs two additions:

```typescript
// In api.ts - each fetch function:
const data = simulateFetch("/api/dashboard/profile", {
  cache: "no-store",                           // <-- add this
  next: { tags: [`profile-${userId}`] },       // <-- add this
  headers: { "x-user-id": userId },
});
```

And the cache key needs the user ID:

```typescript
// In UserDashboard.ts:
export function getDashboardCacheKey(userId: string): string {
  return `dashboard-data-${userId}`;  // was just "dashboard-data"
}
```

Apply the same `cache: 'no-store'` + `next.tags` pattern to all three fetch functions (profile, billing, orders), using the appropriate tag prefix for each.
