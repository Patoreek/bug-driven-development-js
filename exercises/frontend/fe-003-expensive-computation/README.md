# Expensive Computation

**ID:** `fe-003-expensive-computation`  
**Difficulty:** ★★☆☆☆  
**Estimated Time:** 15 minutes  
**Tags:** `react`, `performance`, `useMemo`, `optimization`  
**Prerequisites:** None

---

## The Scenario

You're working on an e-commerce admin panel. The product listing page shows a filterable, sortable table of products with computed statistics (total value, average price). Users complain that toggling the "dark mode" theme or typing in an unrelated notes field causes noticeable lag on the page, even though neither action affects the product data.

## The Bug

An expensive computation (sorting + aggregating product statistics) runs on every single render, even when the product data and sort/filter criteria haven't changed. Unrelated state changes (like toggling a theme or typing in a notes field) trigger the full recomputation unnecessarily.

## Your Task

1. Examine `src/ProductList.tsx` and find the computation that runs unnecessarily
2. Memoize the expensive computation so it only recalculates when its inputs change
3. Ensure all tests pass
4. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/ProductList.tsx` | Product listing with expensive sorting and stats |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [useMemo](https://react.dev/reference/react/useMemo) — memoizing expensive calculations
- [When to use useMemo](https://react.dev/reference/react/useMemo#should-you-add-usememo-everywhere) — when memoization is appropriate
