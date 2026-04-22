# Hint 2 (Medium)

The concept you need is **test isolation**. Each test should start with a fresh mock. Use `beforeEach` to create a new `vi.fn()` mock before every test, and `afterEach` with `vi.restoreAllMocks()` to clean up after every test. Each test should then configure its own mock response using `mockResolvedValueOnce`.
