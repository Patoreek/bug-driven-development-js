# Error Swallowing

**ID:** `be-005-error-swallowing`  
**Difficulty:** ★★☆☆☆  
**Estimated Time:** 15 minutes  
**Tags:** `error-handling`, `debugging`, `api`, `typescript`  
**Prerequisites:** None

---

## The Scenario

You're maintaining an order processing service for an online store. Customer support has been flooded with tickets saying "Something went wrong" when users try to place orders. The engineering team can't figure out what's failing because every error in the system is caught and replaced with the same generic message. Whether it's an out-of-stock item, an invalid payment, or a network timeout, users always see "Something went wrong."

## The Bug

The `processOrder` function has try/catch blocks that swallow all errors and return the same generic error message regardless of what actually went wrong. The original error details are completely lost, making debugging impossible and giving users no actionable feedback.

## Your Task

1. Refactor `src/order-service.ts` to use typed error classes and return meaningful error messages with appropriate status codes
2. Different failure scenarios should produce different error types and messages
3. Ensure all tests pass
4. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/order-service.ts` | Order processing service with error handling |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Error Handling Best Practices](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates) — TypeScript error narrowing
- [Custom Error Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#custom_error_types) — extending the Error class
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) — choosing the right status code
