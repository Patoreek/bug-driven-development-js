# Hint 1 (Mild)

Look at the three `await` calls in `loadData()`. Which fetches truly depend on each other, and which could start earlier? The shipping fetch only needs `orderId`, which is already available.
