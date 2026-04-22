# Explanation: Error Swallowing

## The Bug

Every error in the system was caught and replaced with the same generic message:

```ts
catch (e) {
  return { status: 500, body: { error: "Something went wrong" } };
}
```

This made debugging impossible. Whether the product didn't exist, was out of stock, or the payment failed, the user always saw "Something went wrong" with a 500 status.

## The Fix

1. **Created typed error classes** that extend `Error` with a `code` and `statusCode`:

```ts
class OrderError extends Error {
  constructor(message: string, public code: string, public statusCode: number) { ... }
}
class NotFoundError extends OrderError { ... }    // 404
class OutOfStockError extends OrderError { ... }  // 409
class PaymentError extends OrderError { ... }     // 402 or 400
```

2. **Threw specific errors** from helper functions instead of generic `Error`:

```ts
throw new NotFoundError(`Product ${productId} not found`);
```

3. **Caught and handled errors by type** in the main handler:

```ts
catch (e) {
  if (e instanceof OrderError) {
    return { status: e.statusCode, body: { error: e.message, code: e.code } };
  }
  // Only truly unknown errors get a generic response
}
```

## Key Takeaway

Error swallowing is one of the most insidious anti-patterns. It hides bugs, frustrates users, and makes debugging nearly impossible. Use typed error classes to categorize failures, return appropriate HTTP status codes, and include descriptive messages. Only use generic messages for truly unexpected errors that might leak sensitive implementation details.
