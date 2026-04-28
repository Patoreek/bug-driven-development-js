# LRU Cache

**ID:** `lc-019-lru-cache`
**Difficulty:** ★★★★☆
**Estimated Time:** 35 minutes
**Tags:** `design`, `hash-map`, `linked-list`, `doubly-linked-list`
**Prerequisites:** None

---

## The Problem

Design a data structure that follows the constraints of a **Least Recently Used (LRU) cache**.

Implement the `LRUCache` class:
- `LRUCache(capacity: number)` — Initialize with positive capacity
- `get(key: number): number` — Return the value if key exists, otherwise -1
- `put(key: number, value: number)` — Update or insert. If at capacity, evict the least recently used key first.

Both `get` and `put` must run in **O(1)** average time complexity.

### Examples

```
LRUCache cache = new LRUCache(2);
cache.put(1, 1);    // cache: {1=1}
cache.put(2, 2);    // cache: {1=1, 2=2}
cache.get(1);       // returns 1, cache: {2=2, 1=1}
cache.put(3, 3);    // evicts key 2, cache: {1=1, 3=3}
cache.get(2);       // returns -1 (not found)
cache.put(4, 4);    // evicts key 1, cache: {3=3, 4=4}
cache.get(1);       // returns -1
cache.get(3);       // returns 3
cache.get(4);       // returns 4
```

### Constraints

- 1 <= capacity <= 3000
- 0 <= key <= 10,000
- 0 <= value <= 100,000
- At most 200,000 calls to get and put

## What's Wrong

The current solution uses a `Map` for O(1) key lookup but tracks access order with an **array**. Moving an element to the end of an array (`indexOf` + `splice`) is **O(n)**, and `shift()` for eviction is also **O(n)**. This makes `get` and `put` both O(n) instead of the required O(1).

## Your Task

1. Redesign the access-order tracking in `src/solution.ts`
2. Both `get` and `put` must be **O(1)** average time
3. All tests must pass, including the performance test
4. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/solution.ts` | Array-based order tracking (O(n) operations) |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Approach)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Data Structure)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Implementation)</summary>See hints/hint-3.md</details>

## Complexity Target

| | get | put |
|---|---|---|
| Current (array) | O(n) | O(n) |
| **Target** | **O(1)** | **O(1)** |
