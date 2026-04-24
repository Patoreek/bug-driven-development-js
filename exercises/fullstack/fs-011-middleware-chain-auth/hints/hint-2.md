# Hint 2 (Medium)

The middleware needs a two-step auth check:
1. Try `verifyAccessToken(accessToken)` first
2. If that fails, try `refreshAccessToken(refreshToken)` using the `refresh_token` cookie
3. Only redirect to `/login` if BOTH steps fail

For the matcher, Next.js supports negative lookahead patterns:
```
"/((?!_next/static|_next/image|favicon.ico).*)"
```

Don't forget: when you refresh the token, you need to set the new `access_token` cookie on the **response** so the browser stores it.
