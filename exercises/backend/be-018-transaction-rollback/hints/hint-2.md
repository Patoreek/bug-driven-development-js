# Hint 2 (Medium)

You need to implement `withTransaction` to provide rollback capability. Since we're using in-memory Maps, you can:

1. Before running the callback, take a snapshot of the current state of `orders`, `inventory`, and `notifications`
2. Run the callback
3. If the callback throws, restore the state from the snapshot
4. Then wrap the three steps in `placeOrder` inside `withTransaction`
