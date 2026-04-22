# Hint 1 (Mild)

The interval ID is stored in a way that makes it subject to the same stale closure problem as any other state value. Consider: does `clearInterval` need to trigger a re-render? Does the interval ID need to be displayed in the UI?
