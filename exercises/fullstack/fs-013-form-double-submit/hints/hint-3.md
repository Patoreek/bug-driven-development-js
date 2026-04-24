# Hint 3 (Strong)

**SubmitButton fix:**
```tsx
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} data-testid="submit-button">
      {pending ? "Placing Order..." : "Place Order"}
    </button>
  );
}
```

**Form fix — add hidden input:**
```tsx
const idempotencyKey = `idem-${useId()}-${Date.now()}`;
// Inside the form:
<input type="hidden" name="idempotencyKey" value={idempotencyKey} />
```

**Server fix — check key before creating order:**
```typescript
const processedKeys = new Map<string, string>();

export function submitOrder(formData: FormData): OrderResult {
  const idempotencyKey = formData.get("idempotencyKey") as string;
  if (idempotencyKey && processedKeys.has(idempotencyKey)) {
    return { success: true, orderId: processedKeys.get(idempotencyKey)! };
  }
  // ... create order, then:
  processedKeys.set(idempotencyKey, orderId);
}
```
