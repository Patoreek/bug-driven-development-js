# Hint 1 (Mild)

Look at the `catch` block. Every possible error — empty order, product not found, out of stock, payment declined — is handled identically with `status: 500` and `"Something went wrong"`.

The tests expect different status codes and different error codes for each failure scenario. What if you had different error types for each?
