# Hint 3 -- Strong

Here is the pattern for each test area:

**User card rendering:**
```typescript
it("shows email by default", () => {
  const html = renderUserCard(testUser);
  expect(html).toContain('<p class="email">jane@example.com</p>');
});

it("hides email when showEmail is false", () => {
  const html = renderUserCard(testUser, { showEmail: false });
  expect(html).not.toContain("jane@example.com");
});
```

**Inactive user:**
```typescript
it("adds inactive class and badge for inactive users", () => {
  const html = renderUserCard(inactiveUser);
  expect(html).toContain("inactive");
  expect(html).toContain('<span class="badge inactive-badge">Inactive</span>');
});
```

**Serialization with exact match:**
```typescript
it("returns all fields in the correct format", () => {
  expect(serializeUser(testUser)).toEqual({
    id: "user-1",
    name: "Jane Doe",
    email: "jane@example.com",
    role: "admin",
    avatarUrl: null,
    joinedAt: "2024-06-15T12:00:00.000Z",
    isActive: true,
  });
});
```

**Summary with structural assertion:**
```typescript
expect(summarizeUsers([testUser, inactiveUser])).toEqual({
  total: 2,
  active: 1,
  inactive: 1,
  byRole: { admin: 1, viewer: 1 },
});
```

The key principle: each test has a descriptive name and assertions that verify exactly the behavior named in the title.
