# Hint 2 (Medium)

When you click the button 3 times before any timeout fires, all 3 `setTimeout` callbacks capture the same `count` value (0). So all 3 will call `setCount(0 + 1)`. The result is `count = 1`, not `count = 3`.
