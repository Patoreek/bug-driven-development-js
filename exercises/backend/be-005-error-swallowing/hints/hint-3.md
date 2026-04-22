# Hint 3 (Strong)

Create a base error class and use it in the catch:

```ts
class OrderError extends Error {
  constructor(message: string, public code: string, public statusCode: number) {
    super(message);
  }
}

// In the catch block:
catch (e) {
  if (e instanceof OrderError) {
    return { status: e.statusCode, body: { error: e.message, code: e.code } };
  }
  return { status: 500, body: { error: "Unknown error", code: "INTERNAL_ERROR" } };
}
```

Update `checkInventory` and `chargePayment` to throw specific subclasses of `OrderError` with the correct codes. Also throw a `ValidationError` for empty items arrays.
