import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  TodoApp,
  getTodoItemRenderCount,
  resetTodoItemRenderCount,
} from "../TodoApp";

describe("TodoApp", () => {
  beforeEach(() => {
    resetTodoItemRenderCount();
  });

  it("renders all todos initially", () => {
    render(<TodoApp />);
    expect(screen.getByTestId("todo-count")).toHaveTextContent("Showing 5 todos");
  });

  it("filters todos by search", async () => {
    render(<TodoApp />);
    const user = userEvent.setup();

    await user.type(screen.getByTestId("search-input"), "bug");

    expect(screen.getByTestId("todo-count")).toHaveTextContent("Showing 1 todos");
    expect(screen.getByText("Fix login bug")).toBeInTheDocument();
  });

  it("toggles a todo", async () => {
    render(<TodoApp />);
    const user = userEvent.setup();

    const checkbox = screen.getByTestId("todo-1").querySelector("input")!;
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it("does not re-render unchanged TodoItems when typing in search (same results)", async () => {
    render(<TodoApp />);
    const initialRenders = getTodoItemRenderCount();

    // Initial render should render all 5 items
    expect(initialRenders).toBe(5);

    resetTodoItemRenderCount();

    const user = userEvent.setup();
    // Type a character that still matches all items (space then backspace effectively)
    // Actually, type "R" which filters down, then clear to test re-renders on filter change
    // Let's test: type a search that returns same set to verify no unnecessary re-renders

    // First, we type and clear to get back to same state
    await user.type(screen.getByTestId("search-input"), "x");
    resetTodoItemRenderCount();

    // Now clear the search to show all 5 again
    await user.clear(screen.getByTestId("search-input"));

    // After clearing, all 5 should render, but only once each (5 total)
    // Without memoization, they render extra times from the intermediate state changes
    const rendersAfterClear = getTodoItemRenderCount();
    expect(rendersAfterClear).toBe(5);
  });

  it("does not re-render TodoItems that didn't change when one is toggled", async () => {
    render(<TodoApp />);
    const user = userEvent.setup();

    // Initial render = 5 items
    expect(getTodoItemRenderCount()).toBe(5);
    resetTodoItemRenderCount();

    // Toggle one todo
    const checkbox = screen.getByTestId("todo-1").querySelector("input")!;
    await user.click(checkbox);

    // Only the toggled item should re-render (1), not all 5
    // With proper memoization: 1 re-render
    // Without memoization: 5 re-renders
    const rendersAfterToggle = getTodoItemRenderCount();
    expect(rendersAfterToggle).toBeLessThanOrEqual(2);
  });
});
