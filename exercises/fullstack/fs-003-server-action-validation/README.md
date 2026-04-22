# Server Action Validation: Trusting Raw Form Data

**ID:** `fs-003-server-action-validation`  
**Difficulty:** ★★★☆☆  
**Estimated Time:** 20 minutes  
**Tags:** `nextjs`, `server-actions`, `zod`, `validation`, `security`  
**Prerequisites:** None

---

## The Scenario

Your team is building an internal tool where employees can create support tickets via a form. The form submits to a Next.js server action that saves the ticket to the database. During a security review, a colleague points out that the server action blindly trusts whatever data comes from the form -- no validation, no sanitization. A malicious user could craft a request with arbitrary data, bypass client-side validation, and inject garbage into the database.

## The Bug

The `createTicket` server action uses `formData.get()` directly and passes raw string values to the database operation without any validation. There's no check for required fields, no length limits, no type coercion for numeric fields, and no error handling for invalid input.

## Your Task

1. Examine `src/actions.ts` and identify the missing validation
2. Add Zod schema validation before processing the form data
3. Return structured error responses for invalid input
4. Ensure all tests pass
5. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/actions.ts` | Server action with unvalidated form data |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) -- form handling in Next.js
- [Zod Validation](https://zod.dev/) -- schema validation library
- [OWASP Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) -- security best practices
