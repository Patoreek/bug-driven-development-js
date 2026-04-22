# Hint 1 (Mild)

Look at every `await sleep(100)` in the tests. What happens if the API takes 150ms instead of 100ms? The element won't be in the DOM yet, and `getByTestId` will throw immediately.
