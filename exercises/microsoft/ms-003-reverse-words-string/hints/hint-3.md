# Hint 3 - Implementation

Add this after the full array reversal:

```typescript
// Step 2: Reverse each word
let start = 0;
for (let i = 0; i <= s.length; i++) {
  if (i === s.length || s[i] === " ") {
    reverse(s, start, i - 1);
    start = i + 1;
  }
}
```

Note the loop goes to `i <= s.length` (not `< s.length`) so that the last word is also reversed when `i === s.length`.
