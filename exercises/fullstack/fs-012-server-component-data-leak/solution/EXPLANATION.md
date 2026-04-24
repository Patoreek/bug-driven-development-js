# Solution: Server Component Data Leak

## The Bug

This is a **critical security vulnerability**. Next.js extends `fetch()` with built-in caching. By default, `fetch()` in server components uses `force-cache`, meaning:

1. First request: fetches from the API, caches the response keyed by URL
2. Subsequent requests: returns the cached response **without hitting the API**

Since all users hit the same URLs (`/api/dashboard/profile`, `/api/dashboard/billing`), and the cache key is URL-based (not header-based), User A's data gets cached and served to User B, User C, etc.

### Why the user ID in the header doesn't help

Next.js fetch cache keys are based on the URL and request method. Custom headers like `x-user-id` or `Authorization` are **not** part of the cache key. Two requests to the same URL with different headers return the same cached response.

## The Fix

### 1. Add `cache: 'no-store'` to all user-specific fetches

```typescript
// Before (cached globally by URL)
fetch("/api/dashboard/profile", {
  headers: { "x-user-id": userId },
});

// After (never cached)
fetch("/api/dashboard/profile", {
  cache: "no-store",
  headers: { "x-user-id": userId },
});
```

### 2. Add per-user cache tags for targeted revalidation

```typescript
fetch("/api/dashboard/profile", {
  cache: "no-store",
  next: { tags: [`profile-${userId}`] },
  headers: { "x-user-id": userId },
});
```

### 3. Fix the cache key to include user ID

```typescript
// Before
export function getDashboardCacheKey(_userId: string): string {
  return "dashboard-data"; // Same for everyone!
}

// After
export function getDashboardCacheKey(userId: string): string {
  return `dashboard-data-${userId}`;
}
```

## Key Takeaway

**Never use default fetch caching for user-specific data.** Always use `cache: 'no-store'` or per-user `next.tags` when the response depends on who's requesting it. This is one of the most dangerous pitfalls of Next.js server components because:

1. The default behavior changed between Next.js versions
2. Everything works in development (no caching)
3. The bug only manifests in production
4. It's a **security vulnerability**, not just a UX bug

## Related Documentation

- [Next.js Caching](https://nextjs.org/docs/app/building-your-application/caching)
- [fetch cache option](https://nextjs.org/docs/app/api-reference/functions/fetch#fetchurl-options)
- [Dynamic Rendering](https://nextjs.org/docs/app/building-your-application/rendering/server-components#dynamic-rendering)

## Interview Context

This is a frequent topic in senior Next.js interviews. Interviewers look for:
- Understanding of when fetch responses are cached in server components
- Knowledge that cache keys are URL-based, not header-based
- Awareness that `cache: 'no-store'` or `revalidate: 0` opts out
- Understanding that `cookies()`/`headers()` force dynamic rendering
- Recognition of the security implications of shared caches
