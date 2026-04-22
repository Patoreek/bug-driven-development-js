# Solution: Data Fetching Waterfall

## The Bug

The component fetches three pieces of data sequentially, each `await`ing the previous:

```tsx
const orderData = await fetchOrder(orderId);          // ~100ms
const customerData = await fetchCustomer(orderData.customerId);  // ~100ms
const shippingData = await fetchShippingStatus(orderId);         // ~100ms
// Total: ~300ms
```

While `fetchCustomer` genuinely depends on `orderData.customerId` (so it must wait for the order), `fetchShippingStatus` only needs `orderId` — which is already available as a prop. It doesn't need to wait for either of the other fetches.

## The Fix

Fetch the order first (since customer depends on it), then run customer and shipping in parallel:

```tsx
const orderData = await fetchOrder(orderId);          // ~100ms

const [customerData, shippingData] = await Promise.all([
  fetchCustomer(orderData.customerId),                // ~100ms (parallel)
  fetchShippingStatus(orderId),                       // ~100ms (parallel)
]);
// Total: ~200ms (33% faster)
```

## Why This Matters

Request waterfalls are one of the most common performance issues in React applications. Each unnecessary sequential request adds latency equal to its duration. In production with real network latency (often 200-500ms per request), the difference between sequential and parallel fetching can mean seconds of extra wait time.

## Key Takeaway

Before awaiting a fetch, ask: "Does this request actually depend on the result of the previous one?" If not, run them in parallel with `Promise.all`. Map out your data dependencies as a graph — only truly dependent requests should be sequential.
