# Hint 1 - Data Structure

Think about what data structure naturally supports "go back to the previous item" operations.

The result array is already being used like a **stack** -- you push directory names onto it. But the current code is missing one key stack operation when it encounters `..`.
