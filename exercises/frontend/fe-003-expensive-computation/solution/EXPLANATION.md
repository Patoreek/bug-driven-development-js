# Solution: Expensive Computation

## The Bug

The `computeProductStats` function runs on every render, including when unrelated state like `notes` or `darkMode` changes:

```tsx
// BUG: Runs on EVERY render
const { sorted, totalValue, averagePrice, totalItems } = computeProductStats(
  PRODUCTS,
  sortBy
);
```

Since `notes` and `darkMode` state changes trigger re-renders, the expensive sort + aggregation runs even though the product data hasn't changed.

## The Fix

Wrap the computation with `useMemo` and specify the actual dependencies:

```tsx
const { sorted, totalValue, averagePrice, totalItems } = useMemo(
  () => computeProductStats(PRODUCTS, sortBy),
  [sortBy]
);
```

Now the computation only runs when `sortBy` changes. Changes to `notes` or `darkMode` re-render the component but skip the expensive calculation.

## Key Takeaway

`useMemo` is the right tool when you have an expensive computation that depends on specific inputs. It caches the result and only recalculates when the dependency array values change. This is especially important when other state changes in the same component would otherwise trigger unnecessary recomputation.
