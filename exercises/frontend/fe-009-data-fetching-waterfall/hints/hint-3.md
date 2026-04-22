# Hint 3 (Strong)

After fetching the order, use `Promise.all` to run customer and shipping fetches in parallel:
```tsx
const orderData = await fetchOrder(orderId);

const [customerData, shippingData] = await Promise.all([
  fetchCustomer(orderData.customerId),
  fetchShippingStatus(orderId),
]);
```
This reduces total time from ~300ms (3 sequential) to ~200ms (order first, then 2 in parallel).
