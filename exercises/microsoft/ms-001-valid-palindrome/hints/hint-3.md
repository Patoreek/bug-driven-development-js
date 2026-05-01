# Hint 3 - Implementation

Here's the structure you need:

```typescript
let left = 0;
let right = s.length - 1;

while (left < right) {
  // Skip non-alphanumeric from the left
  while (left < right && !isAlphanumeric(s[left])) left++;
  // Skip non-alphanumeric from the right
  while (left < right && !isAlphanumeric(s[right])) right--;

  // Compare lowercase versions
  if (s[left].toLowerCase() !== s[right].toLowerCase()) {
    return false;
  }
  left++;
  right--;
}
return true;
```

Write a helper `isAlphanumeric(c: string): boolean` that tests with `/[a-zA-Z0-9]/`.
