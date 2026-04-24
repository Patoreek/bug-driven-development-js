# Multi-Key Sort Order

**ID:** `js-005-sort-stability`
**Difficulty:** ★★★☆☆
**Estimated Time:** 15 minutes
**Tags:** `javascript`, `arrays`, `sort`, `multi-key`, `comparator`, `stable-sort`
**Prerequisites:** `js-002-sort-numeric`

---

## The Scenario

Your HR dashboard needs to display employees grouped by department (alphabetically), with the highest-paid employees listed first within each department. The task management system needs tasks sorted by priority, with older tasks appearing first within the same priority level.

Both features almost work — the primary sort is correct, but the secondary ordering within groups is unreliable or completely missing.

## The Bug

The `sortEmployees` function uses two separate `.sort()` calls — first by salary, then by department. While JavaScript's sort is stable (preserving relative order of equal elements), this approach relies on that stability and is fragile. More importantly, the sort logic doesn't combine both criteria into a single comparator.

The `sortTasks` function only sorts by priority and ignores the creation date entirely, so tasks within the same priority level appear in their original (unsorted) order.

## Your Task

1. Fix `sortEmployees` to sort by department (A-Z), then by salary (high to low) within each department, using a single comparator
2. Fix `sortTasks` to sort by priority (high, medium, low), then by creation date (oldest first) within each priority level
3. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/utils.ts` | Buggy multi-key sort functions |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [MDN: Array.prototype.sort()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) — comparator function
- [MDN: String.prototype.localeCompare()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare) — string comparison
