# Hint 2 (Medium)

React Testing Library provides `findByTestId` which is equivalent to `waitFor(() => getByTestId(...))`. It retries until the element appears or times out. Replace `sleep()` + `getByTestId` with `await screen.findByTestId(...)`.
