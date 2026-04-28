# Solution: Snapshot Regression -- Tests That Hide Bugs

## The Problem

The test suite used `toMatchSnapshot()` for every test, with non-deterministic test data:

```typescript
// BUG: Date changes every day -- snapshots are never stable
const testUser: User = {
  joinedAt: new Date(), // Different output every time
};

// BUG: Captures everything, tests nothing specific
it("renders a user card", () => {
  expect(renderUserCard(testUser)).toMatchSnapshot();
});
```

This creates a vicious cycle:
1. Snapshots fail on every run because the date changed
2. Developer runs `vitest --update` to fix it
3. A real bug gets introduced (e.g., role badge removed)
4. The snapshot changes, developer runs `--update` again without reviewing
5. The bug ships to production undetected

## The Fix

### 1. Use fixed, deterministic dates

```typescript
// Before:
const testUser = { joinedAt: new Date() };

// After:
const FIXED_DATE = new Date("2024-06-15T12:00:00.000Z");
const testUser = { joinedAt: FIXED_DATE };
```

### 2. Replace snapshots with targeted assertions

```typescript
// Before:
it("renders a user card", () => {
  expect(renderUserCard(testUser)).toMatchSnapshot();
});

// After:
it("includes the user name and correct CSS classes", () => {
  const html = renderUserCard(testUser);
  expect(html).toContain('class="user-card role-admin"');
  expect(html).toContain('data-user-id="user-1"');
  expect(html).toContain('<h3 class="name">Jane Doe</h3>');
});
```

### 3. One behavior per test

```typescript
// Before: one test with a massive snapshot covering everything

// After: focused tests for each feature
it("shows email by default", () => { ... });
it("hides email when showEmail is false", () => { ... });
it("shows role badge by default", () => { ... });
it("adds inactive class for inactive users", () => { ... });
```

### 4. Use `toEqual` for structured data

```typescript
// Before:
expect(serializeUser(testUser)).toMatchSnapshot();

// After:
expect(serializeUser(testUser)).toEqual({
  id: "user-1",
  name: "Jane Doe",
  email: "jane@example.com",
  role: "admin",
  avatarUrl: null,
  joinedAt: "2024-06-15T12:00:00.000Z",
  isActive: true,
});
```

## When Snapshots ARE Appropriate

Snapshots are not inherently bad -- they are useful when:
- The output is large and structurally complex (e.g., an AST)
- You want to detect *any* change (not test specific behavior)
- The snapshot is reviewed carefully in code review
- The data is deterministic

They are harmful when:
- They capture volatile data (dates, random IDs, timestamps)
- They are auto-updated without review
- They replace targeted behavioral assertions
- They are the *only* test for important logic

## Documentation

- [Vitest: Snapshot Testing](https://vitest.dev/guide/snapshot)
- [Effective Snapshot Testing (Kent C. Dodds)](https://kentcdodds.com/blog/effective-snapshot-testing)
- [Testing Library: Guiding Principles](https://testing-library.com/docs/guiding-principles)

## Interview Context

Snapshot testing is a frequent discussion topic in frontend and testing interviews. Interviewers may ask: "When would you use snapshot tests?" or "How do you prevent snapshot tests from hiding regressions?" Strong answers mention: using fixed test data, preferring targeted assertions for important behavior, keeping snapshots small and focused, reviewing snapshot diffs in PRs rather than auto-updating, and using inline snapshots for small outputs. The broader principle is that tests should fail for a specific, understandable reason -- not produce an incomprehensible diff that gets rubber-stamped.
