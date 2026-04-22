# Redux Mutation: The Reducer That Broke Immutability

**ID:** `fe-015-redux-mutation`  
**Difficulty:** ★★☆☆☆  
**Estimated Time:** 15 minutes  
**Tags:** `react`, `redux`, `immutability`, `state-management`  
**Prerequisites:** None

---

## The Scenario

You're working on an e-commerce app's shopping cart. The cart reducer handles adding items, removing items, and updating quantities. Customers are reporting that the cart sometimes shows stale data — quantities don't update visually even though the action was dispatched. Another developer mentions that React components connected to the store aren't re-rendering when they should.

## The Bug

The reducer directly mutates the existing state object instead of returning a new one. Methods like `Array.push()` and direct property assignment (`state.items[i].quantity = ...`) modify the original state reference. Since Redux (and React) rely on reference equality checks to detect changes, mutating the same object means the reference doesn't change, so connected components don't re-render.

## Your Task

1. Fix the `cartReducer` to use immutable update patterns (spread operator, `Array.filter`, `Array.map`, etc.)
2. Ensure all tests pass
3. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/cartReducer.ts` | Redux reducer with direct state mutations |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Immutable Update Patterns](https://redux.js.org/usage/structuring-reducers/immutable-update-patterns) — How to update state without mutation
- [Why Immutability Matters](https://redux.js.org/faq/immutable-data#why-is-immutability-required-by-redux) — Redux and reference equality
