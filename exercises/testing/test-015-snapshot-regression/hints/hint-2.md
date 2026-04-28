# Hint 2 -- Medium

Replace `toMatchSnapshot()` with specific assertions. For HTML output, the key tool is `toContain` and `not.toContain`:

```typescript
// Instead of: expect(html).toMatchSnapshot()
// Test specific behaviors:
expect(html).toContain('class="email"');
expect(html).toContain("jane@example.com");
```

For structured data like `serializeUser()`, use `toEqual` with the exact expected object:

```typescript
expect(serialized).toEqual({
  id: "user-1",
  name: "Jane Doe",
  // ... all fields with deterministic values
});
```

Break the monolithic snapshot tests into focused tests: one for email visibility, one for role badge, one for avatar, one for inactive state, etc. Each test should verify one behavior.
