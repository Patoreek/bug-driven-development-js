# Hint 2 -- Medium

Three copy-paste bugs to fix:

1. **"no special character" test**: Expects `"Must contain a digit"` but should expect `"Must contain a special character"`
2. **"basic valid password" strength test**: `"Abcd1!xy"` has all character types + 8 chars, scoring 5 points = `"strong"`, not `"fair"`
3. **"multiple errors" test**: `"ab"` is missing uppercase, digit, special, and is too short = 4 errors, not 3

Then convert the repetitive pattern to `it.each`:
```typescript
it.each([
  { password: "...", expectedError: "..." },
  { password: "...", expectedError: "..." },
])("should reject: $desc", ({ password, expectedError }) => {
  const result = validatePassword(password);
  expect(result.valid).toBe(false);
  expect(result.errors).toContain(expectedError);
});
```
