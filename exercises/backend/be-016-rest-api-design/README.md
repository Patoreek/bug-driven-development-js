# REST API Design

**ID:** `be-016-rest-api-design`  
**Difficulty:** ★★☆☆☆  
**Estimated Time:** 15 minutes  
**Tags:** `rest`, `api-design`, `http-methods`, `status-codes`, `routing`  
**Prerequisites:** None

---

## The Scenario

You've inherited a REST API written by a developer who wasn't familiar with REST conventions. The routes use verbs in URLs (`/api/getUsers`, `/api/createUser`), use wrong HTTP methods (POST for retrieval, GET for creation), and return incorrect status codes (200 for everything). A new frontend team is integrating with the API and needs it to follow standard REST conventions.

## The Bug

The API router has multiple REST convention violations:
- URLs contain verbs instead of being resource-based (`/api/getUsers` instead of `/api/users`)
- HTTP methods are wrong (POST for reads, GET for writes)
- Status codes are always 200 regardless of operation (should be 201 for creation, 204 for deletion)
- GET requests expect a body (which is non-standard)

## Your Task

1. Examine `src/router.ts` and identify all REST convention violations
2. Fix the route definitions to use resource-based URLs
3. Fix the HTTP methods to match REST semantics
4. Fix the status codes to be appropriate for each operation
5. Ensure all tests pass
6. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/router.ts` | API router with REST convention violations |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [REST API Design](https://restfulapi.net/) -- REST principles and conventions
- [HTTP Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) -- GET, POST, PUT, DELETE semantics
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) -- when to use 200, 201, 204, 404
