# Hint 2 (Medium)

Next.js fetch cache keys are based on the **URL only**, not on custom headers. So even though you pass `x-user-id` as a header, all users share the same cached response for `/api/dashboard/profile`.

You need to:
1. Add `cache: 'no-store'` to each fetch call to prevent shared caching
2. Add `next: { tags: [...] }` with user-specific tags for targeted revalidation
3. Fix `getDashboardCacheKey()` to include the `userId` in the returned string
