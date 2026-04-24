# Form Double Submit: Missing Pending State & Idempotency

**ID:** `fs-013-form-double-submit`  
**Difficulty:** ★★★★☆  
**Estimated Time:** 25 minutes  
**Tags:** `next.js`, `forms`, `useFormStatus`, `useActionState`, `idempotency`  
**Prerequisites:** None

---

## The Scenario

Your e-commerce platform's order form has a critical production bug: customers are being charged multiple times. When a user clicks "Place Order" and the network is slow, nothing visually changes, so they click again (and again). Each click creates a new order on the server. Customer support is overwhelmed with refund requests, and the finance team is flagging duplicate charges.

## The Bug

Two problems combine to create duplicate orders:

1. **No pending state on the submit button:** The form uses a plain `<button>` that stays enabled during submission. There's no loading indicator, so users don't know the form is processing and click multiple times.

2. **No server-side idempotency:** The server action creates a new order every time it's called. There's no idempotency key to detect and reject duplicate submissions from the same form interaction.

## Your Task

1. Examine `src/OrderForm.tsx` and `src/submitOrder.ts`
2. Use `useFormStatus` (from `react-dom`) to disable the submit button while the form is pending
3. Add a visual loading state to the button during submission
4. Generate an idempotency key on the client and include it with the form data
5. Implement server-side idempotency checking to reject duplicate submissions

## Files to Modify

| File | Description |
|------|-------------|
| `src/OrderForm.tsx` | Form component missing pending state and idempotency key |
| `src/submitOrder.ts` | Server action that creates duplicates |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [useFormStatus](https://react.dev/reference/react-dom/hooks/useFormStatus) -- pending state for form submissions
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) -- form actions in Next.js
- [Idempotency](https://stripe.com/docs/api/idempotent_requests) -- preventing duplicate operations
