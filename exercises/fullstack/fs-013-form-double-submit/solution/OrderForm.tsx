"use client";

import React, { useId, useState } from "react";
// FIX: Import useFormStatus to get pending state
import { useFormStatus } from "react-dom";
import { submitOrder, type OrderResult } from "./submitOrder";

// FIX: SubmitButton uses useFormStatus to disable during submission
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} data-testid="submit-button">
      {pending ? "Placing Order..." : "Place Order"}
    </button>
  );
}

export function OrderForm() {
  const [result, setResult] = useState<OrderResult | null>(null);

  // FIX: Generate a unique idempotency key for this form instance
  const formInstanceId = useId();
  const idempotencyKey = `idem-${formInstanceId}-${Date.now()}`;

  function handleSubmit(formData: FormData) {
    const orderResult = submitOrder(formData);
    setResult(orderResult);
  }

  return (
    <div>
      <form action={handleSubmit} data-testid="order-form">
        <label htmlFor="product">Product</label>
        <input id="product" name="product" type="text" defaultValue="Widget" />

        <label htmlFor="quantity">Quantity</label>
        <input id="quantity" name="quantity" type="number" defaultValue={1} />

        {/* FIX: Hidden input with idempotency key */}
        <input type="hidden" name="idempotencyKey" value={idempotencyKey} />

        <SubmitButton />
      </form>

      {result?.success && (
        <p data-testid="success-message">Order placed: {result.orderId}</p>
      )}
      {result?.error && (
        <p data-testid="error-message">{result.error}</p>
      )}
    </div>
  );
}
