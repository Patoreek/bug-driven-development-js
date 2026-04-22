# Explanation: Integration Test Boundary

## Why the Tests Were Flawed

The original tests mocked **React's own hooks** (`useState`, `useEffect`) to control the component's internal state. This is the testing equivalent of reaching inside a clock and manually positioning the hands instead of checking if it tells the correct time. The tests were:

1. **Tightly coupled to implementation** -- they knew about 7 specific `useState` calls and their order
2. **Not testing real behavior** -- the API client was never called, the component never went through its real lifecycle
3. **Fragile** -- renaming a state variable, reordering hooks, or using `useReducer` would break every test
4. **Misleading** -- the tests claimed to verify "loading state" and "user data display" but they were actually just asserting that manually-set state produces the expected JSX

## What Was Wrong

```tsx
// BEFORE: Mocking React internals
vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return { ...actual, useState: vi.fn(), useEffect: vi.fn() };
});

it("should display user data after loading", () => {
  const { useState } = require("react");
  useState
    .mockReturnValueOnce([mockUser, vi.fn()])   // user state
    .mockReturnValueOnce([false, vi.fn()])      // loading state
    .mockReturnValueOnce([null, vi.fn()])       // error state
    // ... 4 more mock returns
  render(<UserProfile userId="user-1" apiClient={mockApiClient} />);
  // This tests that JSX renders when state is manually set -- not that the component works
});
```

## The Fix

```tsx
// AFTER: Mock at the boundary (apiClient), test real behavior
function createMockApiClient(): UserApiClient {
  return {
    getUser: vi.fn().mockResolvedValue(mockUser),
    updateUser: vi.fn().mockResolvedValue(mockUser),
  };
}

it("should display user data after loading", async () => {
  const apiClient = createMockApiClient();
  render(<UserProfile userId="user-1" apiClient={apiClient} />);

  // Wait for the real loading -> fetch -> render cycle
  expect(await screen.findByText("Jane Doe")).toBeInTheDocument();
  expect(apiClient.getUser).toHaveBeenCalledWith("user-1");
});
```

The key difference: the component goes through its **real lifecycle**. `useEffect` fires, `getUser` is called (with the mock response), state updates happen naturally, and the DOM reflects the final state. We only mock what crosses the system boundary: the network call.

## The Boundary Principle

**Mock at the boundary of your system, not inside it.**

| Good boundary to mock | Bad thing to mock |
|----------------------|-------------------|
| API client / fetch | React hooks |
| Database driver | Internal state |
| File system | Private methods |
| External services | Component lifecycle |

The `UserProfile` component accepts `apiClient` as a prop -- this is **dependency injection**, a clean boundary for testing. The component's internal state management is an implementation detail that should be free to change.

## What This Tests That Mocks Can't

The solution tests real user flows:
- Loading state appears, then disappears when data loads
- Clicking "Edit Profile" actually shows the form with pre-filled values
- Typing in the form, clicking Save, and seeing the updated data
- Canceling reverts to original values
- Error states appear when the API fails

None of these flows work when `useState` is mocked -- you're just testing that the initial mock values render correctly.

## Interview Context

This is a senior/staff-level testing question:
- "Where do you draw the line between what to mock and what to test for real?"
- "What's wrong with mocking React hooks in your tests?"
- "How do you test a component that makes API calls?"

The answer: inject dependencies (API clients, services) and mock those. Let React do its job. Test the component like a user would interact with it, not like a developer would debug it.
