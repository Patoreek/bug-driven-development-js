# Server Component Data Leak: Cross-User Cache Contamination

**ID:** `fs-012-server-component-data-leak`  
**Difficulty:** ★★★★★  
**Estimated Time:** 35 minutes  
**Tags:** `next.js`, `server-components`, `caching`, `security`, `data-leak`  
**Prerequisites:** None

---

## The Scenario

Your team launched a dashboard that shows user-specific data (profile, billing, recent orders). A critical bug report came in: User A logged in and saw User B's billing information and order history. The security team is panicking. After investigation, you discover the server component that fetches user data is being cached by Next.js's fetch cache, and the cache key doesn't include any user-specific identifier. The first user's data gets cached, and all subsequent users see that same cached response.

## The Bug

Multiple issues create this data leak:

1. **Default fetch caching:** The `fetch()` calls in the data-fetching functions use the default cache behavior (`force-cache`), which caches the response globally. Since the URL is the same for all users (`/api/dashboard`), all users share one cached response.

2. **User ID passed as header, not in URL:** The user identifier is sent via an `Authorization` header, but Next.js fetch cache keys are based on URL only by default, not headers. Different users hitting the same URL get the same cached data.

3. **No dynamic rendering opt-out:** The server component doesn't use `cookies()` or `headers()` to signal that it needs per-request rendering, so Next.js may statically optimize it.

## Your Task

1. Examine `src/api.ts` and `src/UserDashboard.ts`
2. Fix the fetch calls to prevent cross-user caching
3. Ensure each user gets their own data by including user-specific cache tags or disabling caching
4. Add proper cache invalidation strategy using `next.revalidate` tags or `cache: 'no-store'`
5. Ensure the component opts out of static rendering

## Files to Modify

| File | Description |
|------|-------------|
| `src/UserDashboard.ts` | Server component data fetcher that caches across users |
| `src/api.ts` | API fetch functions with incorrect caching defaults |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Next.js Caching](https://nextjs.org/docs/app/building-your-application/caching) -- how Next.js caches fetch requests
- [Opting Out of Caching](https://nextjs.org/docs/app/building-your-application/caching#opting-out-1) -- cache: 'no-store' and revalidate: 0
- [Dynamic Functions](https://nextjs.org/docs/app/building-your-application/rendering/server-components#dynamic-functions) -- cookies(), headers()
