# Key Prop Chaos: When Index Keys Break Your List

**ID:** `fe-011-key-prop-list`  
**Difficulty:** ★★☆☆☆  
**Estimated Time:** 15 minutes  
**Tags:** `react`, `keys`, `reconciliation`, `lists`  
**Prerequisites:** None

---

## The Scenario

Your team built a simple todo list where users can add items, remove them, and check them off. QA just filed a bug: when a user deletes a todo from the middle of the list, the checkbox states get mixed up. For example, if items 1, 2, and 3 are shown and item 2 is checked, deleting item 1 causes item 2 (now in position 0) to appear unchecked, while item 3 (now in position 1) suddenly appears checked. Users are confused and frustrated.

A senior dev glanced at the code and muttered something about "keys" before heading to lunch.

## The Bug

The list component renders todo items using the array index as the React `key` prop. When items are removed or reordered, React's reconciliation algorithm matches components by their key (position), not by the actual data they represent. This causes input states (like checkboxes) to become associated with the wrong items.

## Your Task

1. Fix the `TodoList` component so that each item uses a stable, unique identifier as its key
2. Ensure all tests pass
3. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/TodoList.tsx` | Todo list component with buggy key usage |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [React Lists and Keys](https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key) — Why keys matter for reconciliation
- [Index as Key Anti-pattern](https://robinpokorny.com/blog/index-as-a-key-is-an-anti-pattern/) — When index keys cause problems
