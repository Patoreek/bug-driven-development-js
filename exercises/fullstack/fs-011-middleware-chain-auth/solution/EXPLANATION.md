# Solution: Middleware Chain Auth

## The Bug

Two separate issues caused poor user experience and wasted resources:

### 1. No Token Refresh Logic

The middleware only checked the access token. When it expired (every 15 minutes), users were immediately redirected to `/login` even though they had a valid refresh token (lasting 7 days). The `refreshAccessToken()` function existed in `auth.ts` but was never called.

### 2. No Middleware Matcher

Without a `config.matcher` export, Next.js runs the middleware on every single request, including:
- `_next/static/*` (JavaScript/CSS bundles)
- `_next/image/*` (optimized images)
- `favicon.ico`
- Other static assets

This adds unnecessary authentication checks and latency to static file serving.

## The Fix

### Token Refresh Flow

```typescript
// Before: Immediately redirect on expired token
const payload = verifyAccessToken(accessToken);
if (!payload) {
  return createRedirectResponse("/login");
}

// After: Try refresh before giving up
let payload = verifyAccessToken(accessToken);
if (payload) {
  return createNextResponse({ "x-user-id": payload.userId });
}

// Try refresh
const refreshResult = refreshAccessToken(refreshToken);
if (refreshResult.success && refreshResult.accessToken) {
  payload = verifyAccessToken(refreshResult.accessToken);
  if (payload) {
    const response = createNextResponse({ "x-user-id": payload.userId });
    response.cookies["access_token"] = refreshResult.accessToken;
    return response;
  }
}

// Both failed — now redirect
return createRedirectResponse("/login");
```

### Matcher Config

```typescript
// Before: No matcher — runs on ALL requests

// After: Exclude static assets
export const matcherConfig = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

## Key Takeaway

Next.js middleware is powerful but runs on every matched request. Always:
1. Export a `config.matcher` to limit which routes trigger middleware
2. Implement token refresh flows — don't force re-login when a refresh token is available
3. Set refreshed tokens as cookies on the response so subsequent requests use them

## Related Documentation

- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Middleware Matcher](https://nextjs.org/docs/app/building-your-application/routing/middleware#matching-paths)

## Interview Context

Token refresh in middleware is a common senior-level question. Interviewers look for:
- Understanding of access vs. refresh token patterns
- Knowing that middleware must forward new cookies on the response
- Awareness that middleware runs on ALL requests without a matcher
- Understanding the security tradeoff of refreshing in middleware vs. a dedicated endpoint
