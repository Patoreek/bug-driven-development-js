# Optimistic Update Rollback: Missing Revert on Server Failure

**ID:** `fs-006-optimistic-update-rollback`  
**Difficulty:** ★★★☆☆  
**Estimated Time:** 20 minutes  
**Tags:** `optimistic-updates`, `rollback`, `state-management`, `error-handling`, `fullstack`  
**Prerequisites:** None

---

## The Scenario

You are building a todo list app that uses optimistic updates for a snappy UI. When a user toggles a todo's completed status, the UI updates instantly before the server confirms the change. However, QA reports that when the server rejects the toggle (e.g., due to a conflict or network error), the UI stays in the wrong state -- the checkbox shows "completed" even though the server never accepted the change.

## The Bug

The `toggleTodo` function optimistically flips the todo's `completed` status and notifies listeners. When the server returns a failure response, it sets an error message but never rolls back the optimistic state change. The UI is now out of sync with the server.

## Your Task

1. Save a snapshot of the todos before the optimistic update
2. If the server returns failure, restore the snapshot (rollback)
3. Ensure all tests pass
4. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/todoList.ts` | Todo store with broken optimistic update rollback |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Optimistic Updates](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates) -- pattern overview
- [useOptimistic](https://react.dev/reference/react/useOptimistic) -- React's built-in optimistic hook
- [Error Recovery Patterns](https://www.patterns.dev/react/optimistic-pattern) -- handling failures gracefully
