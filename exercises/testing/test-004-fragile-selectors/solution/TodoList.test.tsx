import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoList } from "../TodoList";

describe("TodoList", () => {
  const initialTodos = [
    { id: "1", text: "Buy groceries", completed: false },
    { id: "2", text: "Walk the dog", completed: true },
  ];

  it("should render the heading", () => {
    render(<TodoList initialTodos={initialTodos} />);

    expect(screen.getByRole("heading", { name: "My Todo List" })).toBeInTheDocument();
  });

  it("should render all todo items", () => {
    render(<TodoList initialTodos={initialTodos} />);

    expect(screen.getByText("Buy groceries")).toBeInTheDocument();
    expect(screen.getByText("Walk the dog")).toBeInTheDocument();
  });

  it("should show completed count", () => {
    render(<TodoList initialTodos={initialTodos} />);

    expect(screen.getByText("1 of 2 tasks completed")).toBeInTheDocument();
  });

  it("should add a new todo", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    await user.type(screen.getByLabelText("Add a task"), "New task");
    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(screen.getByText("New task")).toBeInTheDocument();
  });

  it("should toggle a todo's completed state", async () => {
    const user = userEvent.setup();
    render(<TodoList initialTodos={initialTodos} />);

    // Use the checkbox associated with the todo text
    const buyCheckbox = screen.getByRole("checkbox", { name: /Buy groceries/ });
    expect(buyCheckbox).not.toBeChecked();

    await user.click(buyCheckbox);

    expect(buyCheckbox).toBeChecked();
    expect(screen.getByText("2 of 2 tasks completed")).toBeInTheDocument();
  });

  it("should delete a todo", async () => {
    const user = userEvent.setup();
    render(<TodoList initialTodos={initialTodos} />);

    // Use the accessible aria-label to find the right delete button
    await user.click(screen.getByRole("button", { name: "Delete Buy groceries" }));

    expect(screen.queryByText("Buy groceries")).not.toBeInTheDocument();
    expect(screen.getByText("Walk the dog")).toBeInTheDocument();
  });
});
