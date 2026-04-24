# Middleware Chain Auth: Token Refresh & Static Asset Filtering

**ID:** `fs-011-middleware-chain-auth`  
**Difficulty:** ★★★★☆  
**Estimated Time:** 30 minutes  
**Tags:** `next.js`, `middleware`, `auth`, `token-refresh`, `matcher`  
**Prerequisites:** None

---

## The Scenario

Your team shipped an authentication system using Next.js middleware. It checks for a valid access token on every request and redirects to `/login` if the token is expired. Users started complaining that they're randomly logged out even though they were active just seconds ago. The support team confirmed that access tokens expire after 15 minutes, but there's a valid refresh token cookie that lasts 7 days. Additionally, the DevTools Network tab shows the middleware running on every `_next/static` and image request, adding latency to page loads.

## The Bug

Two problems exist in the middleware:

1. **No token refresh logic:** When the access token expires, the middleware immediately redirects to `/login` even though a valid refresh token exists in the cookies. It never attempts to use the refresh token to get a new access token.

2. **Middleware runs on static assets:** The middleware has no `config.matcher`, so it runs on every request including `_next/static/*`, `_next/image/*`, `favicon.ico`, and other static files. This wastes server resources and adds unnecessary latency.

## Your Task

1. Examine `src/middleware.ts` and `src/auth.ts`
2. Add token refresh logic: when the access token is expired but a valid refresh token exists, call `refreshAccessToken()` and set the new token cookie on the response
3. Only redirect to `/login` when BOTH the access token is expired AND the refresh fails
4. Add a proper `config.matcher` export to exclude static assets and public routes
5. Ensure the refreshed token cookie is forwarded on the response

## Files to Modify

| File | Description |
|------|-------------|
| `src/middleware.ts` | Middleware that checks auth but lacks refresh logic and matcher |
| `src/auth.ts` | Auth utility functions including token verification and refresh |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware) -- middleware config and matchers
- [Middleware Matching Paths](https://nextjs.org/docs/app/building-your-application/routing/middleware#matching-paths) -- config.matcher
- [NextResponse Cookies](https://nextjs.org/docs/app/api-reference/functions/next-response#cookies) -- setting cookies on responses
