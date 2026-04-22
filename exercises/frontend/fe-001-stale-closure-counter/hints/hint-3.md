# Hint 3 (Strong)

Replace `setCount(count + 1)` with `setCount(prev => prev + 1)`. The functional updater form of `setState` always receives the most recent state value, avoiding the stale closure problem.
