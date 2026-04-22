# Unvalidated API Input

**ID:** `be-001-unvalidated-api-input`  
**Difficulty:** ★★☆☆☆  
**Estimated Time:** 15 minutes  
**Tags:** `api`, `validation`, `zod`, `security`, `next.js`  
**Prerequisites:** None

---

## The Scenario

You joined a startup building an e-commerce platform. The team just shipped a "Create Product" API endpoint so merchants can add items to their store. QA noticed that submitting empty strings, negative prices, or missing fields doesn't produce any error — instead, garbage data ends up in the database. The original author assumed the frontend would always send valid data.

## The Bug

The API route handler reads fields directly from the request body without any validation or type checking. It trusts that `name`, `price`, and `category` will always be present and correctly typed. This means invalid data (empty names, negative prices, wrong types) is silently accepted and processed.

## Your Task

1. Add Zod schema validation to `src/handler.ts` so that invalid input is rejected with a 400 status and descriptive error messages
2. Ensure valid input still returns a 201 status with the created product
3. Ensure all tests pass
4. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/handler.ts` | API route handler for creating products |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Zod Documentation](https://zod.dev/) — TypeScript-first schema validation
- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) — API route patterns
- [OWASP Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) — why input validation matters
