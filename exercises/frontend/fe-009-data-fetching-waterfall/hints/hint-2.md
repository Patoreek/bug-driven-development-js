# Hint 2 (Medium)

`fetchShippingStatus(orderId)` doesn't need data from `fetchOrder` — it only uses `orderId`, which is a prop. `fetchCustomer` does need `orderData.customerId`, so it must wait for the order. But shipping and customer can be fetched in parallel after the order is loaded.
