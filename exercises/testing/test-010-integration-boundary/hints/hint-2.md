# Hint 2 (Medium)

Remove the `vi.mock("react")` block. Create a mock API client with `vi.fn()` methods:

```ts
const apiClient: UserApiClient = {
  getUser: vi.fn().mockResolvedValue(mockUser),
  updateUser: vi.fn().mockResolvedValue(updatedUser),
};
```

Render the component normally and use RTL's async utilities:
- `screen.findByText("Jane Doe")` -- waits for the API to resolve and the component to re-render
- `screen.findByRole("alert")` -- waits for error state to appear
- For loading state, use a promise that never resolves: `vi.fn().mockReturnValue(new Promise(() => {}))`
