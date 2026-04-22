# Hint 2 (Medium)

You need to add **assertions** to each test. Use React Testing Library queries like `screen.getByText()`, `screen.getByRole()`, and `screen.getByAltText()` to find elements, then wrap them in `expect(...).toBeInTheDocument()`. For checking absence, use `screen.queryByText()` with `expect(...).not.toBeInTheDocument()`.
