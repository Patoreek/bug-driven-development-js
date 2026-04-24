# Solution: Form Double Submit

## The Bug

Two missing safeguards allowed duplicate order creation:

### 1. No Pending State (Client-Side)

The submit button was a plain `<button>` with no awareness of the form's submission state. React provides `useFormStatus()` specifically for this — it returns a `pending` boolean that's `true` while the form action is executing. Without it, the button stays clickable and shows no loading feedback.

### 2. No Idempotency (Server-Side)

Even with a disabled button, network issues, browser extensions, or aggressive users can still send duplicate requests. The server action had no mechanism to detect "I've already processed this exact submission." Every call created a new order.

## The Fix

### Client-Side: useFormStatus

```tsx
// Before
function SubmitButton() {
  return <button type="submit">Place Order</button>;
}

// After
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Placing Order..." : "Place Order"}
    </button>
  );
}
```

**Important:** `useFormStatus` must be called from a component that is a **child** of the `<form>`. It won't work if called in the same component that renders the form.

### Client-Side: Idempotency Key

```tsx
// Generate a unique key per form instance
const idempotencyKey = `idem-${useId()}-${Date.now()}`;

// Include in form as hidden input
<input type="hidden" name="idempotencyKey" value={idempotencyKey} />
```

### Server-Side: Check Key Before Creating

```typescript
const processedKeys = new Map<string, string>();

export function submitOrder(formData: FormData): OrderResult {
  const idempotencyKey = formData.get("idempotencyKey") as string;

  // Return existing order if key was already processed
  if (idempotencyKey && processedKeys.has(idempotencyKey)) {
    return { success: true, orderId: processedKeys.get(idempotencyKey)! };
  }

  // Create new order and record the key
  // ...
  processedKeys.set(idempotencyKey, orderId);
}
```

## Key Takeaway

Defense in depth: use **both** client-side prevention (disable button) and server-side protection (idempotency keys). Neither alone is sufficient — a disabled button can be bypassed, and idempotency without UX feedback frustrates users.

## Related Documentation

- [useFormStatus](https://react.dev/reference/react-dom/hooks/useFormStatus)
- [Stripe Idempotent Requests](https://stripe.com/docs/api/idempotent_requests)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)

## Interview Context

Double-submit prevention is a classic fullstack interview question. Interviewers expect:
- Knowledge of `useFormStatus` and why SubmitButton must be a separate child component
- Understanding of idempotency keys and why client-side-only prevention is insufficient
- Awareness that `useFormStatus` only works with the `action` prop, not `onSubmit`
- Ability to explain the tradeoff between `useFormStatus` and `useActionState`
