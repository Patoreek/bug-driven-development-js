# Transaction Rollback

**ID:** `be-018-transaction-rollback`  
**Difficulty:** ★★★★☆  
**Estimated Time:** 25 minutes  
**Tags:** `database`, `transactions`, `rollback`, `atomicity`, `data-integrity`  
**Prerequisites:** None

---

## The Scenario

Your e-commerce platform processes orders through a three-step flow: (1) create the order record, (2) deduct inventory, and (3) queue a confirmation notification. A spike in support tickets reveals that some customers are being charged and seeing "order created" records in their account, but the items were never deducted from inventory because step 2 failed. The database is left in an inconsistent state because step 1 isn't rolled back when step 2 fails.

## The Bug

The `placeOrder` function performs three sequential database operations without a transaction. If step 2 (inventory deduction) or step 3 (notification) fails, step 1 (order creation) has already been committed and is not rolled back. This leaves the system in an inconsistent state: an order exists but inventory was never updated.

## Your Task

1. Examine `src/orders.ts` and identify where the atomicity guarantee is missing
2. Implement the `withTransaction` function to wrap operations in a transaction
3. Fix `placeOrder` to use the transaction so all steps succeed or all are rolled back
4. Ensure all tests pass
5. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/orders.ts` | Order processing without transaction safety |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [ACID Transactions](https://en.wikipedia.org/wiki/ACID) -- Atomicity, Consistency, Isolation, Durability
- [Database Transactions](https://www.postgresql.org/docs/current/tutorial-transactions.html) -- PostgreSQL transaction tutorial
- [Error Handling Patterns](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) -- try/catch/finally
