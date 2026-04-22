# Hint 3 (Strong)

Replace the direct function call with:
```tsx
const { sorted, totalValue, averagePrice, totalItems } = useMemo(
  () => computeProductStats(PRODUCTS, sortBy),
  [sortBy]
);
```
`PRODUCTS` is a constant defined outside the component, so it doesn't need to be in the dependency array. Only `sortBy` changes between renders.
