# SQL Injection in Query Builder

**ID:** `be-002-sql-injection`  
**Difficulty:** ★★☆☆☆  
**Estimated Time:** 15 minutes  
**Tags:** `sql`, `security`, `injection`, `parameterized-queries`  
**Prerequisites:** None

---

## The Scenario

You've inherited a user search feature for an internal admin tool. The database query functions build SQL strings using template literals, directly interpolating user-supplied values. During a security audit, the team flagged these queries as vulnerable to SQL injection attacks. Your job is to refactor the query builder to use parameterized queries.

## The Bug

The query builder functions construct SQL strings by embedding user input directly into the query via template literals. An attacker could craft malicious input like `'; DROP TABLE users; --` to execute arbitrary SQL. The functions return the raw SQL string instead of a safe query/params pair.

## Your Task

1. Refactor the query builder functions in `src/query-builder.ts` to return parameterized queries (a `{ text, params }` object)
2. User input must appear in the `params` array, never in the SQL string itself
3. Ensure all tests pass
4. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/query-builder.ts` | Database query builder functions |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [OWASP SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection) — understanding SQL injection attacks
- [Parameterized Queries](https://cheatsheetseries.owasp.org/cheatsheets/Query_Parameterization_Cheat_Sheet.html) — the standard defense
- [node-postgres Parameterized Queries](https://node-postgres.com/features/queries#parameterized-query) — using $1, $2 placeholders
