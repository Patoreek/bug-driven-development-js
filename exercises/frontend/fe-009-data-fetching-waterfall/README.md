# Data Fetching Waterfall

**ID:** `fe-009-data-fetching-waterfall`  
**Difficulty:** ★★★☆☆  
**Estimated Time:** 25 minutes  
**Tags:** `react`, `data-fetching`, `performance`, `Promise.all`, `async`  
**Prerequisites:** None

---

## The Scenario

You're working on an order details page for an e-commerce site. The page needs to show the order info, customer details, and shipping status. A product manager complains that the page takes over 3 seconds to load, even though each individual API call only takes about 1 second. The data fetching is structured as a waterfall: each request waits for the previous one to complete before starting.

## The Bug

The component fetches data sequentially: first the order, then the customer (using the customer ID from the order), then the shipping status (using the order ID). While the customer fetch genuinely depends on the order data, the shipping fetch could run in parallel with the customer fetch since it only needs the order ID (which is already known). The architecture creates an unnecessary waterfall.

## Your Task

1. Examine `src/OrderDetails.tsx` and identify the unnecessary sequential fetching
2. Restructure to fetch data in parallel where dependencies allow
3. Ensure all tests pass
4. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/OrderDetails.tsx` | Order details page with sequential API calls |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) — running promises in parallel
- [Data fetching patterns](https://react.dev/reference/react/useEffect#fetching-data-with-effects) — React data fetching
