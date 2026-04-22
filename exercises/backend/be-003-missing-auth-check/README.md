# Missing Authorization Check

**ID:** `be-003-missing-auth-check`  
**Difficulty:** ★★☆☆☆  
**Estimated Time:** 15 minutes  
**Tags:** `auth`, `authorization`, `security`, `api`, `middleware`  
**Prerequisites:** None

---

## The Scenario

You're working on a content management system. The API has a "Delete Article" endpoint that only editors and admins should be able to use. A penetration tester discovered that any authenticated user — even those with a basic "viewer" role — can delete articles. The endpoint checks that the user is logged in, but never checks what role they have.

## The Bug

The handler verifies that an auth token exists (authentication) but never checks the user's role (authorization). Any authenticated user can delete any article regardless of their permissions. There is also no ownership check — users in allowed roles should only be able to delete their own articles unless they are admins.

## Your Task

1. Add authorization checks to `src/handler.ts` so that only users with `admin` or `editor` roles can delete articles
2. Non-admin editors should only be able to delete their own articles
3. Return 401 for missing/invalid tokens and 403 for insufficient permissions
4. Ensure all tests pass
5. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/handler.ts` | Delete article API handler with auth logic |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [OWASP Broken Access Control](https://owasp.org/Top10/A01_2021-Broken_Access_Control/) — the #1 web security risk
- [Authentication vs Authorization](https://auth0.com/docs/get-started/identity-fundamentals/authentication-and-authorization) — knowing who vs. what they can do
- [Role-Based Access Control](https://en.wikipedia.org/wiki/Role-based_access_control) — RBAC patterns
