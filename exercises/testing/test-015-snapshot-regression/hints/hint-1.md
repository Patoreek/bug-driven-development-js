# Hint 1 -- Mild

Start with the test data. The `testUser` uses `new Date()` which changes every day, making any snapshot non-deterministic. Replace it with a fixed date:

```typescript
const FIXED_DATE = new Date("2024-06-15T12:00:00.000Z");
```

This ensures the rendered output is identical on every run, regardless of when or where the tests execute.

Then look at how the tests use `toMatchSnapshot()` -- each one captures the entire output, but none of them assert on the specific feature they claim to test. "Renders without email" should actually check that the email is absent, not just that the output matches some saved blob.
