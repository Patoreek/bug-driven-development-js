# Hint 2 (Medium)

React Testing Library provides async utilities for this exact situation:

- **`findByText`** / **`findByRole`** -- these return Promises that resolve when the element appears in the DOM. They're the async version of `getByText` / `getByRole`.
- **`waitFor`** -- takes a callback and re-runs it until it stops throwing (useful for complex assertions).

Import `waitFor` from `@testing-library/react` and use `screen.findByText()` instead of `screen.getByText()` after async operations.
