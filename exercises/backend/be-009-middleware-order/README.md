# Middleware Ordering Bug

**ID:** `be-009-middleware-order`  
**Difficulty:** ★★★☆☆  
**Estimated Time:** 20 minutes  
**Tags:** `middleware`, `express`, `security`, `request-pipeline`, `ordering`  
**Prerequisites:** None

---

## The Scenario

Your team's Express-like API has a middleware pipeline that handles request IDs, logging, body parsing, authentication, and admin authorization. After a recent refactor, requests started failing in confusing ways: logging doesn't include request IDs, the body parser runs too late, and the admin check sometimes crashes with a 500 error instead of returning a proper 403. The root cause is that the middleware functions are registered in the wrong order.

## The Bug

The `getDefaultPipeline` function returns middleware in the wrong order:
- Logging runs before the request ID is assigned, so requests aren't tracked
- Body parsing runs after authentication, so the auth layer can't access the parsed body
- The request ID middleware runs too late in the pipeline
- Admin authorization can crash because it runs before authentication sets `req.user`

## Your Task

1. Fix the middleware ordering in `getDefaultPipeline` in `src/middleware.ts`
2. The correct order should be: requestId -> logging -> bodyParser -> auth -> adminOnly
3. Do NOT modify the middleware functions themselves -- only change their order
4. Ensure all tests pass
5. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/middleware.ts` | Middleware pipeline with incorrect ordering |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Express Middleware](https://expressjs.com/en/guide/using-middleware.html) -- how middleware ordering works
- [Request Pipeline](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/middleware/) -- middleware pipeline concepts
- [Chain of Responsibility Pattern](https://refactoring.guru/design-patterns/chain-of-responsibility) -- the design pattern behind middleware
