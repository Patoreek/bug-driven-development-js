# Hint 3 (Strong)

Here's the structure of the fixed middleware:

```typescript
import { verifyAccessToken, refreshAccessToken, isPublicPath } from "./auth";

export function middleware(request) {
  if (isPublicPath(pathname)) return createNextResponse();

  const accessToken = request.cookies["access_token"];
  const refreshToken = request.cookies["refresh_token"];

  // Step 1: Try access token
  let payload = verifyAccessToken(accessToken);
  if (payload) {
    return createNextResponse({ "x-user-id": payload.userId, ... });
  }

  // Step 2: Try refresh
  const result = refreshAccessToken(refreshToken);
  if (result.success && result.accessToken) {
    payload = verifyAccessToken(result.accessToken);
    if (payload) {
      const response = createNextResponse({ "x-user-id": payload.userId, ... });
      response.cookies["access_token"] = result.accessToken; // <-- critical!
      return response;
    }
  }

  // Step 3: Both failed
  return createRedirectResponse("/login");
}

export const matcherConfig = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
```
