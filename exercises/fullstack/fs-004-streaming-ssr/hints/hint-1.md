# Hint 1 (Mild)

The Dashboard awaits all three fetches sequentially. The page cannot render anything until ALL of them resolve. Think about which fetches are fast enough to block on and which are too slow.
