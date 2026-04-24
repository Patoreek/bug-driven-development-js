# Hint 2 -- Medium

Replace the concrete classes with mock objects created from `vi.fn()`:

```typescript
const httpClient: HttpClient = {
  get: vi.fn(),
  post: vi.fn(),
};

const logger: Logger = {
  info: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
};
```

Then use `.mockResolvedValueOnce()` to control exactly what each call returns. Create fresh mocks in `beforeEach` so no state leaks between tests. To test payment failure, just mock the post to return `{ success: false, error: "..." }` -- no retrying needed.
