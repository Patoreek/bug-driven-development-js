# Number of Islands

**ID:** `lc-015-number-of-islands`
**Difficulty:** ★★★☆☆
**Estimated Time:** 25 minutes
**Tags:** `matrix`, `dfs`, `flood-fill`, `graph`
**Prerequisites:** None

---

## The Problem

Given an `m x n` 2D binary grid which represents a map of `'1'`s (land) and `'0'`s (water), return the number of islands.

An island is surrounded by water and is formed by connecting adjacent lands **horizontally or vertically**. Diagonal connections do not count. All four edges of the grid are surrounded by water.

### Examples

```
Input:
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
Output: 1

Input:
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
Output: 3
```

### Constraints

- m == grid.length
- n == grid[i].length
- 1 <= m, n <= 300
- grid[i][j] is '0' or '1'

## What's Wrong

The current solution counts every land cell `'1'` as a separate island. It has a DFS function, but the DFS does not mark cells as visited (by setting them to `'0'`) and the recursive calls are commented out to avoid infinite recursion. As a result, connected land cells are each counted individually instead of being grouped into one island.

## Your Task

1. Fix the `dfs` function in `src/solution.ts` to properly flood-fill connected land
2. Mark visited cells so they aren't counted again
3. All tests must pass
4. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/solution.ts` | Broken DFS that doesn't mark visited cells |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Approach)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Data Structure)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Implementation)</summary>See hints/hint-3.md</details>

## Complexity Target

| | Time | Space |
|---|---|---|
| Current | O(m*n) (but wrong result) | O(1) |
| **Target** | **O(m*n)** | **O(m*n)** worst case stack |
