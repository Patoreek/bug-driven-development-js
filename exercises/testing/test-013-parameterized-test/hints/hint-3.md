# Hint 3 -- Strong

Here's the full structure:

```typescript
describe("valid passwords", () => {
  it.each([
    { password: "MyP@ssw0rd!", desc: "standard strong" },
    { password: "C0mpl3x!Pass#2025", desc: "very strong" },
    { password: "Abcd1!xy", desc: "minimum length" },
  ])("should accept: $desc", ({ password }) => {
    const result = validatePassword(password);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });
});

describe("invalid passwords", () => {
  it.each([
    { password: "MyPassw0rd", expectedError: "Must contain a special character", desc: "no special" },
    // ... all other invalid cases
  ])("should reject ($desc)", ({ password, expectedError }) => {
    const result = validatePassword(password);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain(expectedError);
  });
});

describe("strength ratings", () => {
  it.each([
    { password: "abc", expectedStrength: "weak" },
    { password: "Abcd1!xy", expectedStrength: "strong" },  // Fixed: was "fair"
    { password: "C0mpl3x!Pass#2025", expectedStrength: "very-strong" },
  ])("should rate $password as $expectedStrength", ({ password, expectedStrength }) => {
    expect(validatePassword(password).strength).toBe(expectedStrength);
  });
});

// For multiple errors, assert each error individually + correct count:
const result = validatePassword("ab");
expect(result.errors).toHaveLength(4); // Fixed: was 3
```
