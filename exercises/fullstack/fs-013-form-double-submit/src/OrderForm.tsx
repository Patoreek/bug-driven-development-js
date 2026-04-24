// BUG: Form component that allows double-submit because:
// 1. No useFormStatus to disable button during submission
// 2. No idempotency key sent with the form
// 3. No visual feedback during submission

"use client";

import React, { useState } from "react";
import { submitOrder, type OrderResult } from "./submitOrder";

// BUG: SubmitButton doesn't use useFormStatus — button stays enabled during submission
function SubmitButton() {
  return (
    <button type="submit" data-testid="submit-button">
      Place Order
    </button>
  );
}

export function OrderForm() {
  const [result, setResult] = useState<OrderResult | null>(null);

  // BUG: No idempotency key generated for this form instance

  function handleSubmit(formData: FormData) {
    // BUG: No idempotency key appended to formData
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

        {/* BUG: No hidden input for idempotency key */}

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
