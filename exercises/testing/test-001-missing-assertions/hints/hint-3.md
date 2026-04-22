# Hint 3 (Strong)

Here's the pattern for each test:

1. **Render test**: After rendering, assert `expect(screen.getByText("Alice Johnson")).toBeInTheDocument()`
2. **Role test**: Assert the mapped role label appears (e.g., "editor" maps to "Editor")
3. **Avatar present**: Use `screen.getByAltText()` and check `toHaveAttribute("src", url)`
4. **Avatar absent**: Use `screen.queryByAltText()` and `not.toBeInTheDocument()`
5. **Contact click**: Use `userEvent.setup()`, click the button, then `expect(handleContact).toHaveBeenCalledWith("eve@example.com")`
6. **No contact button**: Use `screen.queryByRole("button", { name: "Contact" })` and `not.toBeInTheDocument()`
