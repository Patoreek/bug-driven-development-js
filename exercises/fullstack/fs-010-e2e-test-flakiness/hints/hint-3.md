# Hint 3 (Strong)

Replace all timing-dependent patterns:

```tsx
// Wait for element to appear:
expect(await screen.findByTestId("notification-list")).toBeInTheDocument();

// Wait for element to disappear:
await waitFor(() => {
  expect(screen.queryByTestId("mark-read-n1")).not.toBeInTheDocument();
});

// Wait for text to change:
await waitFor(() => {
  expect(screen.getByTestId("unread-badge")).toHaveTextContent("(1)");
});
```

Delete the `sleep` helper function and all `act(async () => { await sleep(...) })` blocks.
