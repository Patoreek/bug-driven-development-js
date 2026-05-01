# Hint 2 - The Missing Operation

When you encounter `..`, you need to go to the **parent** directory. In terms of the stack, this means **removing** the last directory that was added.

Look at the line that handles `..`. It currently does `continue` (skip), but it should be doing something else to the `result` array first.

The `Array.prototype.pop()` method removes and returns the last element.
