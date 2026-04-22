# N+1 Query Problem

**ID:** `be-004-n-plus-one-query`  
**Difficulty:** ★★★☆☆  
**Estimated Time:** 20 minutes  
**Tags:** `performance`, `database`, `n-plus-one`, `optimization`  
**Prerequisites:** None

---

## The Scenario

Your team's dashboard page loads a list of users along with their post counts. In development with 5 test users, it works fine. In production with 500 users, the page takes 8 seconds to load. A senior engineer profiled the database queries and found the classic N+1 problem: the code fetches all users with one query, then makes a separate query for each user's posts.

## The Bug

The `getUsersWithPostCounts` function first queries all users (1 query), then loops through each user and fetches their posts individually (N queries). For 500 users, this means 501 database queries instead of a single batched query. The code is functionally correct but has O(N) query complexity.

## Your Task

1. Refactor `src/user-posts.ts` to fetch all data using a batched approach instead of one-by-one queries
2. The result should be identical — the tests verify both correctness and the number of queries made
3. Ensure all tests pass
4. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/user-posts.ts` | Function that fetches users with post counts |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [N+1 Query Problem](https://www.prisma.io/docs/guides/performance/query-optimization-performance#solving-the-n1-problem) — explanation and solutions
- [SQL IN clause](https://www.w3schools.com/sql/sql_in.asp) — fetching multiple records at once
- [SQL GROUP BY](https://www.w3schools.com/sql/sql_groupby.asp) — aggregating data in a single query
