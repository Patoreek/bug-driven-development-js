# Hint 3 (Strong)

Change the `getDefaultPipeline` function to return the middleware in the correct order:

```ts
export function getDefaultPipeline(): Middleware[] {
  return [
    requestIdMiddleware,    // 1. Assign tracking ID
    loggingMiddleware,      // 2. Log the request (needs requestId)
    bodyParserMiddleware,   // 3. Parse body (before auth needs it)
    authMiddleware,         // 4. Authenticate user
    adminOnlyMiddleware,    // 5. Check admin role (needs req.user)
  ];
}
```
