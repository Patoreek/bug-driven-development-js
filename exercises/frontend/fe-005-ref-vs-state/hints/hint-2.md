# Hint 2 (Medium)

`useState` values are captured in closures at the time a callback is created. When `handleStop` fires, the `intervalId` it sees may be from a previous render, not the current one. React has another hook designed for mutable values that need to be "always current."
