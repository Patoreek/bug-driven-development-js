# Hint 2 (Medium)

Create custom error classes that carry a `code` and `statusCode`:

- Empty order: status 400, code `EMPTY_ORDER`
- Product not found: status 404, code `PRODUCT_NOT_FOUND`
- Out of stock: status 409, code `OUT_OF_STOCK`
- Payment declined: status 402, code `PAYMENT_DECLINED`
- Invalid payment: status 400, code `INVALID_PAYMENT`

Then in the `catch` block, check `instanceof` to determine which error type it is.
