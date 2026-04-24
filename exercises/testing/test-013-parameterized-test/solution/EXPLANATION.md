# Explanation: Copy-Paste Test Suite

## Why the Bug Happens

Copy-paste is the enemy of correctness in test suites. When you duplicate 10 lines and change 2 values, you have 8 lines that could be wrong but look right because they came from a "working" test. The original suite has three concrete copy-paste bugs:

### 1. Wrong error expectation (no special character test)

```typescript
// The password "MyPassw0rd" has no special character, but the test checks:
expect(result.errors).toContain("Must contain a digit"); // Copied from wrong test!
// Should be:
expect(result.errors).toContain("Must contain a special character");
```

### 2. Wrong strength rating

```typescript
// "Abcd1!xy" scores: length>=8(1) + mixed case(1) + digit(1) + special(1) + no repeats(1) = 5 = "strong"
expect(result.strength).toBe("fair"); // Wrong! Copied expectation from different password
```

### 3. Wrong error count

```typescript
// "ab" fails: too short + no uppercase + no digit + no special = 4 errors
expect(result.errors).toHaveLength(3); // Wrong!
```

## The Fix

### Before (buggy)

```typescript
it("should reject password without special character", () => {
  const result = validatePassword("MyPassw0rd");
  expect(result.valid).toBe(false);
  expect(result.errors).toContain("Must contain a digit"); // WRONG
});

it("should reject password without digit", () => {
  const result = validatePassword("MyP@ssword!");
  expect(result.valid).toBe(false);
  expect(result.errors).toContain("Must contain a digit");
});
// ... 18 more nearly identical tests
```

### After (fixed)

```typescript
it.each([
  { password: "MyPassw0rd", expectedError: "Must contain a special character", desc: "no special" },
  { password: "MyP@ssword!", expectedError: "Must contain a digit", desc: "no digit" },
  // Adding a new case = just one new row
])("should reject ($desc): expects '$expectedError'", ({ password, expectedError }) => {
  const result = validatePassword(password);
  expect(result.valid).toBe(false);
  expect(result.errors).toContain(expectedError);
});
```

## Why `it.each` Prevents Bugs

1. **Data and logic separated**: The test body is written once and correct; only the data varies
2. **Easy to review**: All inputs and expected outputs are in a table -- mismatches are visible at a glance
3. **Easy to extend**: Adding a test case is adding one row, not duplicating 10 lines
4. **Descriptive names**: `$variable` interpolation in test names makes failures easy to identify

## Common Variations

1. **`describe.each`**: When you want to parameterize an entire describe block, not just individual tests
2. **Tagged template literals**: `it.each\`a | b | expected\n1 | 2 | 3\`` for a more readable table format
3. **Shared setup in table**: Include setup data in each row (e.g., mock configurations)

## Interview Context

Parameterized testing comes up when interviewers ask about test maintainability. They look for:
- Ability to identify duplication and its risks
- Knowledge of `it.each` / `test.each` patterns
- Understanding that tests are code too and deserve the same quality standards
- Awareness that copy-paste bugs are the most dangerous because they look correct

## References

- [Vitest: test.each](https://vitest.dev/api/#test-each)
- [Vitest: describe.each](https://vitest.dev/api/#describe-each)
- [AHA Testing](https://kentcdodds.com/blog/aha-testing) -- Avoid Hasty Abstractions
