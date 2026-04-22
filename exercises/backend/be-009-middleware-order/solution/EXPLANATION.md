# Explanation: Middleware Ordering Bug

## The Bug

The middleware pipeline was registered in the wrong order:

```ts
// BROKEN order:
return [
  loggingMiddleware,      // runs before requestId — can't log it
  authMiddleware,
  bodyParserMiddleware,   // runs after auth — body not available
  requestIdMiddleware,    // runs too late
  adminOnlyMiddleware,
];
```

This caused multiple failures:
1. **Logging had no request ID** -- `loggingMiddleware` checked `req.requestId` but it hadn't been set yet
2. **Body not parsed for auth** -- `bodyParserMiddleware` ran after `authMiddleware`, so the parsed body wasn't available
3. **Admin check could crash** -- if the ordering was shuffled wrong, `adminOnlyMiddleware` could run before `authMiddleware` set `req.user`

## The Fix

Reorder the middleware to respect dependencies:

```ts
return [
  requestIdMiddleware,    // 1. Assign tracking ID first
  loggingMiddleware,      // 2. Log the request (needs requestId)
  bodyParserMiddleware,   // 3. Parse body (before auth)
  authMiddleware,         // 4. Authenticate user
  adminOnlyMiddleware,    // 5. Check authorization (needs req.user)
];
```

## Key Takeaway

Middleware order matters. In Express and similar frameworks, middleware runs in registration order. Each middleware can depend on data set by earlier middleware. A common ordering is: infrastructure (IDs, timing) -> logging -> parsing -> authentication -> authorization -> route handler. Getting this wrong can cause subtle bugs or security vulnerabilities.

## References

- [Express.js: Using Middleware](https://expressjs.com/en/guide/using-middleware.html)
- [ASP.NET Core Middleware Order](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/middleware/)

## Interview Context

Middleware ordering is a popular interview topic for backend roles. Interviewers want to see that you understand the request pipeline, know which middleware depends on which, and can reason about the correct execution order. A classic mistake is putting authentication after route handlers or logging before request IDs are assigned.
