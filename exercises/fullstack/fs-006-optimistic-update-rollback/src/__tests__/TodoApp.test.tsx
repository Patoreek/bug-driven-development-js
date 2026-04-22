import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoApp } from "../TodoApp";

const baseTodos = [
  { id: "1", text: "Buy groceries", completed: false },
  { id: "2", text: "Walk the dog", completed: true },
  { id: "fail-1", text: "This will fail", completed: false },
];

describe("TodoApp optimistic updates", () => {
  it("renders all todos", () => {
    render(<TodoApp initialTodos={baseTodos} />);
    expect(screen.getByTestId("text-1")).toHaveTextContent("Buy groceries");
    expect(screen.getByTestId("text-2")).toHaveTextContent("Walk the dog");
    expect(screen.getByTestId("text-fail-1")).toHaveTextContent("This will fail");
  });

  it("shows initial completed states", () => {
    render(<TodoApp initialTodos={baseTodos} />);
    expect(screen.getByTestId("checkbox-1")).not.toBeChecked();
    expect(screen.getByTestId("checkbox-2")).toBeChecked();
  });

  it("optimistically toggles a todo on click", async () => {
    const user = userEvent.setup();
    render(<TodoApp initialTodos={baseTodos} />);

    // Click to toggle "Buy groceries" to completed
    await user.click(screen.getByTestId("checkbox-1"));

    // Should immediately show as checked (optimistic)
    expect(screen.getByTestId("checkbox-1")).toBeChecked();
  });

  it("keeps toggle after successful server response", async () => {
    const user = userEvent.setup();
    render(<TodoApp initialTodos={baseTodos} />);

    await user.click(screen.getByTestId("checkbox-1"));

    // Wait for server response
    await waitFor(() => {
      expect(screen.getByTestId("checkbox-1")).toBeChecked();
    });
  });

  it("rolls back toggle when server returns error", async () => {
    const user = userEvent.setup();
    render(<TodoApp initialTodos={baseTodos} />);

    // Toggle the "fail-1" todo -- server will reject this
    const checkbox = screen.getByTestId("checkbox-fail-1");
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);

    // Should initially show as checked (optimistic)
    expect(checkbox).toBeChecked();

    // After server error, should roll back to unchecked
    await waitFor(() => {
      expect(screen.getByTestId("checkbox-fail-1")).not.toBeChecked();
    });
  });

  it("shows error message when server fails", async () => {
    const user = userEvent.setup();
    render(<TodoApp initialTodos={baseTodos} />);

    await user.click(screen.getByTestId("checkbox-fail-1"));

    // Should show an error message
    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toBeInTheDocument();
    });
  });

  it("clears error message after successful toggle", async () => {
    const user = userEvent.setup();
    render(<TodoApp initialTodos={baseTodos} />);

    // Trigger an error first
    await user.click(screen.getByTestId("checkbox-fail-1"));
    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toBeInTheDocument();
    });

    // Now toggle a valid todo
    await user.click(screen.getByTestId("checkbox-1"));
    await waitFor(() => {
      expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
    });
  });
});
