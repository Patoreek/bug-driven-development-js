# Solution: Transaction Rollback

## The Bug

The `placeOrder` function performed three sequential operations without a transaction:

```ts
const order = await createOrder(userId, items);     // Step 1: committed immediately
await deductInventory(items);                        // Step 2: may fail!
await queueNotification(userId, order.id);           // Step 3: may fail!
```

If step 2 failed, the order from step 1 was already in the database with status "pending" -- an orphaned record. If step 2 succeeded but step 3 failed, inventory was deducted but the order stayed "pending" and no notification was sent.

The `withTransaction` function was a no-op -- it just ran the callback without any rollback capability.

## The Fix

### 1. Implemented snapshot/restore for `withTransaction`
Since we're working with in-memory Maps (simulating a database), the transaction mechanism takes a deep snapshot before running operations and restores it on failure:

```ts
export async function withTransaction<T>(fn) {
  const snapshot = snapshotState();
  try {
    const result = await fn(tx);
    return result;
  } catch (error) {
    restoreState(snapshot);  // Rollback on error
    throw error;
  }
}
```

### 2. Wrapped `placeOrder` in a transaction
```ts
const orderId = await withTransaction(async () => {
  const order = await createOrder(userId, items);
  await deductInventory(items);
  await queueNotification(userId, order.id);
  order.status = "confirmed";
  return order.id;
});
```

Now if any step throws, the entire state is rolled back to the pre-operation snapshot. The order, inventory changes, and notifications are all undone atomically.

## Key Takeaway

Multi-step operations that must succeed or fail together need transactions. In a real database, you'd use `BEGIN`/`COMMIT`/`ROLLBACK` SQL statements (or an ORM's transaction API). The principle is the same: take a savepoint, execute all operations, and roll back to the savepoint if anything fails. This is the "A" (Atomicity) in ACID.
