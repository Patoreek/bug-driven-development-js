# Hint 2 — Data Structure

Use a **stack** (array with push/pop).

- When you see an opening bracket (`(`, `[`, `{`), **push** it onto the stack
- When you see a closing bracket (`)`, `]`, `}`), **pop** from the stack and check if it matches

If the stack is empty when you try to pop (unmatched closing bracket), or the popped bracket doesn't match the current closing bracket, return `false`.

At the end, the stack should be empty (no unmatched opening brackets).
