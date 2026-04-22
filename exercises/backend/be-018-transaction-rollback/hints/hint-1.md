# Hint 1 (Mild)

Consider what happens when `deductInventory` throws an error. The order created in step 1 is already stored in the `orders` Map. The `catch` block returns a failure response, but the order record persists. This is an inconsistent state -- the order exists but inventory was never updated.
