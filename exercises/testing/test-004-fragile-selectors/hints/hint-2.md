# Hint 2 (Medium)

RTL's recommended query priority is: `getByRole` > `getByLabelText` > `getByText` > `getByTestId`. The component has:
- An `<h1>` (use `getByRole("heading")`)
- A `<label htmlFor="new-todo">` (use `getByLabelText("Add a task")`)
- Buttons with text (use `getByRole("button", { name: "Add" })`)
- Delete buttons with `aria-label` (use `getByRole("button", { name: "Delete Buy groceries" })`)
- Checkboxes wrapped in labels with text (use `getByRole("checkbox", { name: /Buy groceries/ })`)
