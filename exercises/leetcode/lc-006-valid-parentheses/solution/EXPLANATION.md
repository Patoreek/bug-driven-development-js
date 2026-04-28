# Explanation — Valid Parentheses

## The Buggy Approach (What's Given)

```typescript
let openCount = 0;
let closeCount = 0;

for (const char of s) {
  if (char === "(" || char === "[" || char === "{") openCount++;
  else if (char === ")" || char === "]" || char === "}") closeCount++;
}

return openCount === closeCount;
```

This only checks that the **number** of opening brackets equals the number of closing brackets. It completely ignores:

1. **Type matching**: `"(]"` has 1 open and 1 close, but the types don't match
2. **Ordering**: `")("` has equal counts, but the closing bracket comes before the opening
3. **Nesting**: `"([)]"` has equal counts, but the brackets are interleaved rather than properly nested

## The Optimal Approach

### Key Insight

Bracket validation requires knowing not just *how many* brackets are open, but *which specific brackets* are open and *in what order*. A **stack** perfectly captures this: the most recently opened bracket is on top, and it must be closed first (LIFO).

### Algorithm Walkthrough

Given `s = "([{}])"`:

| Char | Action | Stack |
|------|--------|-------|
| `(` | Push | `[("(")]` |
| `[` | Push | `["(", "["]` |
| `{` | Push | `["(", "[", "{"]` |
| `}` | Pop `{`, matches `}` | `["(", "["]` |
| `]` | Pop `[`, matches `]` | `["("]` |
| `)` | Pop `(`, matches `)` | `[]` |

Stack is empty at end. Valid.

Now `s = "([)]"`:

| Char | Action | Stack |
|------|--------|-------|
| `(` | Push | `["("]` |
| `[` | Push | `["(", "["]` |
| `)` | Pop `[`, does NOT match `)`. Return false | - |

Invalid. The `[` was opened most recently but `)` tries to close a `(`.

### The Fix

```typescript
export function isValid(s: string): boolean {
  const stack: string[] = [];
  const matchMap: Record<string, string> = {
    ")": "(",
    "]": "[",
    "}": "{",
  };

  for (const char of s) {
    if (char === "(" || char === "[" || char === "{") {
      stack.push(char);
    } else if (char in matchMap) {
      if (stack.length === 0 || stack.pop() !== matchMap[char]) {
        return false;
      }
    }
  }

  return stack.length === 0;
}
```

## Complexity Analysis

| Approach | Time | Space |
|----------|------|-------|
| Counting (buggy) | O(n) | O(1) |
| **Stack-based** | **O(n)** | **O(n)** |

Each character is processed once (push or pop). In the worst case (all opening brackets), the stack holds n/2 elements.

## Three Failure Modes

1. **Extra closing bracket**: stack is empty when we encounter a closing bracket -> `")("`, `"]"`
2. **Type mismatch**: popped bracket doesn't match -> `"(]"`, `"([)]"`
3. **Extra opening bracket**: stack is non-empty after processing all characters -> `"(("`, `"({"`

All three are covered by the solution.

## Common Interview Follow-ups

- **"What about just one type of bracket?"** A simple counter suffices. Increment for `(`, decrement for `)`. If it goes negative or doesn't reach zero, invalid.
- **"Remove minimum brackets to make valid?"** BFS/stack approach to find minimum removals.
- **"Longest valid parentheses substring?"** Stack-based or DP approach. Classic hard problem.
- **"Generate all valid combinations of n pairs?"** Backtracking/recursion (catalan numbers).

## References

- [LeetCode 20. Valid Parentheses](https://leetcode.com/problems/valid-parentheses/)
- [MDN: Array.prototype.push()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push)
- [MDN: Array.prototype.pop()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop)
