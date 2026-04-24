# Hint 1 (Mild)

JavaScript's `===` operator for strings is NOT constant-time. It returns `false` at the first differing character. Node.js provides a built-in function in the `crypto` module specifically designed for secure comparisons. Look at what's available in `crypto` for this purpose.
