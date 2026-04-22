import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { TodoList } from "../TodoList";

describe("TodoList", () => {
  it("renders the initial list of todos", () => {
    render(<TodoList />);
    expect(screen.getByText("Buy groceries")).toBeInTheDocument();
    expect(screen.getByText("Walk the dog")).toBeInTheDocument();
    expect(screen.getByText("Read a book")).toBeInTheDocument();
  });

  it("can add a new todo", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    const input = screen.getByLabelText("New todo");
    await user.type(input, "Clean the kitchen");
    await user.click(screen.getByText("Add"));

    expect(screen.getByText("Clean the kitchen")).toBeInTheDocument();
  });

  it("can remove a todo", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    await user.click(screen.getByLabelText("Remove Walk the dog"));
    expect(screen.queryByText("Walk the dog")).not.toBeInTheDocument();
    expect(screen.getByText("Buy groceries")).toBeInTheDocument();
    expect(screen.getByText("Read a book")).toBeInTheDocument();
  });

  it("preserves checkbox state when an earlier item is removed", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    // Check the "Read a book" checkbox (third item)
    const readCheckbox = screen.getByLabelText("Complete Read a book");
    await user.click(readCheckbox);
    expect(readCheckbox).toBeChecked();

    // Remove "Buy groceries" (first item)
    await user.click(screen.getByLabelText("Remove Buy groceries"));

    // "Read a book" should still be checked
    const readCheckboxAfter = screen.getByLabelText("Complete Read a book");
    expect(readCheckboxAfter).toBeChecked();

    // "Walk the dog" should still be unchecked
    const walkCheckbox = screen.getByLabelText("Complete Walk the dog");
    expect(walkCheckbox).not.toBeChecked();
  });

  it("preserves checkbox state when a middle item is removed", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    // Check "Buy groceries" (first item)
    const buyCheckbox = screen.getByLabelText("Complete Buy groceries");
    await user.click(buyCheckbox);
    expect(buyCheckbox).toBeChecked();

    // Remove "Walk the dog" (middle item)
    await user.click(screen.getByLabelText("Remove Walk the dog"));

    // "Buy groceries" should still be checked
    const buyCheckboxAfter = screen.getByLabelText("Complete Buy groceries");
    expect(buyCheckboxAfter).toBeChecked();

    // "Read a book" should still be unchecked
    const readCheckbox = screen.getByLabelText("Complete Read a book");
    expect(readCheckbox).not.toBeChecked();
  });

  it("uses stable keys based on item id, not array index", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    // Verify data-testid attributes are tied to the correct items
    expect(screen.getByTestId("todo-a1")).toHaveTextContent("Buy groceries");
    expect(screen.getByTestId("todo-b2")).toHaveTextContent("Walk the dog");
    expect(screen.getByTestId("todo-c3")).toHaveTextContent("Read a book");

    // Remove first item
    await user.click(screen.getByLabelText("Remove Buy groceries"));

    // Remaining items should still have correct test IDs
    expect(screen.queryByTestId("todo-a1")).not.toBeInTheDocument();
    expect(screen.getByTestId("todo-b2")).toHaveTextContent("Walk the dog");
    expect(screen.getByTestId("todo-c3")).toHaveTextContent("Read a book");
  });
});
