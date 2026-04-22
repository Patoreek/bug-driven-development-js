# Hint 3 (Strong)

Here's the replacement for each test:

1. **Heading**: `screen.getByRole("heading", { name: "My Todo List" })` instead of `container.querySelector("h1")`
2. **Todo items**: `screen.getByText("Buy groceries")` instead of `container.querySelectorAll("li")`
3. **Completed count**: `screen.getByText("1 of 2 tasks completed")` instead of `container.querySelector("p")`
4. **Add input**: `screen.getByLabelText("Add a task")` instead of `container.querySelector("input[type='text']")`
5. **Add button**: `screen.getByRole("button", { name: "Add" })` instead of `container.querySelector("button[type='submit']")`
6. **Toggle checkbox**: `screen.getByRole("checkbox", { name: /Buy groceries/ })` and assert with `toBeChecked()`
7. **Delete button**: `screen.getByRole("button", { name: "Delete Buy groceries" })` using the `aria-label`
