import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoList } from "../TodoList";

// BUG: These tests use fragile CSS selectors and DOM structure assumptions
// instead of accessible RTL queries. They break when class names change
// or the markup is restructured, even if the functionality is identical.

describe("TodoList", () => {
  const initialTodos = [
    { id: "1", text: "Buy groceries", completed: false },
    { id: "2", text: "Walk the dog", completed: true },
  ];

  it("should render the heading", () => {
    const { container } = render(<TodoList initialTodos={initialTodos} />);

    // BUG: Fragile -- queries by tag name instead of role
    const heading = container.querySelector("h1");
    expect(heading?.textContent).toBe("My Todo List");
  });

  it("should render all todo items", () => {
    const { container } = render(<TodoList initialTodos={initialTodos} />);

    // BUG: Fragile -- queries by tag name, tightly coupled to DOM structure
    const items = container.querySelectorAll("li");
    expect(items.length).toBe(2);
  });

  it("should show completed count", () => {
    const { container } = render(<TodoList initialTodos={initialTodos} />);

    // BUG: Fragile -- queries by tag name and relies on specific DOM position
    const paragraph = container.querySelector("p");
    expect(paragraph?.textContent).toContain("1 of 2");
  });

  it("should add a new todo", async () => {
    const user = userEvent.setup();
    const { container } = render(<TodoList />);

    // BUG: Fragile -- queries by CSS selector instead of label/role
    const input = container.querySelector("input[type='text']") as HTMLInputElement;
    const button = container.querySelector("button[type='submit']") as HTMLButtonElement;

    await user.type(input, "New task");
    await user.click(button);

    // BUG: Fragile -- queries by tag name again
    const items = container.querySelectorAll("li");
    expect(items.length).toBe(1);
  });

  it("should toggle a todo's completed state", async () => {
    const user = userEvent.setup();
    const { container } = render(<TodoList initialTodos={initialTodos} />);

    // BUG: Fragile -- queries by CSS selector and index position
    const checkboxes = container.querySelectorAll("input[type='checkbox']");
    await user.click(checkboxes[0]);

    // BUG: Fragile -- checks style attribute directly
    const spans = container.querySelectorAll("li span");
    expect((spans[0] as HTMLElement).style.textDecoration).toBe("line-through");
  });

  it("should delete a todo", async () => {
    const user = userEvent.setup();
    const { container } = render(<TodoList initialTodos={initialTodos} />);

    // BUG: Fragile -- queries buttons by index, assumes DOM order
    const deleteButtons = container.querySelectorAll("li button");
    await user.click(deleteButtons[0]);

    const items = container.querySelectorAll("li");
    expect(items.length).toBe(1);
  });
});
