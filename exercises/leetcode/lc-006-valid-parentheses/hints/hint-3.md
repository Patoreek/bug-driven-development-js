# Hint 3 — Implementation

```
matchMap = { ")": "(", "]": "[", "}": "{" }
stack = []

for each char in s:
    if char is opening bracket:
        stack.push(char)
    else if char is closing bracket:
        if stack is empty or stack.pop() !== matchMap[char]:
            return false

return stack.length === 0
```

A lookup map from closing to opening bracket makes the matching clean. The three failure modes are:
1. Closing bracket with empty stack (extra closing)
2. Popped bracket doesn't match (wrong type)
3. Non-empty stack at the end (extra opening)
