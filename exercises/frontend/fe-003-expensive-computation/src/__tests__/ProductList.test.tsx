import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  ProductList,
  getComputationCount,
  resetComputationCount,
} from "../ProductList";

describe("ProductList", () => {
  beforeEach(() => {
    resetComputationCount();
  });

  it("renders all products", () => {
    render(<ProductList />);
    expect(screen.getByTestId("product-list").children).toHaveLength(8);
  });

  it("displays stats correctly", () => {
    render(<ProductList />);
    expect(screen.getByTestId("stats")).toHaveTextContent("Total Items: 1935");
  });

  it("sorts by price when button is clicked", async () => {
    render(<ProductList />);
    const user = userEvent.setup();

    await user.click(screen.getByTestId("sort-price"));

    const items = screen.getByTestId("product-list").children;
    // First item should be the most expensive (Standing Desk at $499.99)
    expect(items[0]).toHaveTextContent("Standing Desk");
  });

  it("does NOT recompute when typing in notes field", async () => {
    render(<ProductList />);
    const initialCount = getComputationCount();
    expect(initialCount).toBe(1); // Computed once on mount

    const user = userEvent.setup();
    await user.type(screen.getByTestId("notes-input"), "some notes here");

    // Should still be 1 — notes changes should not trigger recomputation
    expect(getComputationCount()).toBe(1);
  });

  it("does NOT recompute when toggling dark mode", async () => {
    render(<ProductList />);
    expect(getComputationCount()).toBe(1);

    const user = userEvent.setup();
    await user.click(screen.getByTestId("toggle-theme"));
    await user.click(screen.getByTestId("toggle-theme"));

    // Should still be 1 — theme changes should not trigger recomputation
    expect(getComputationCount()).toBe(1);
  });

  it("DOES recompute when sort order changes", async () => {
    render(<ProductList />);
    expect(getComputationCount()).toBe(1);

    const user = userEvent.setup();
    await user.click(screen.getByTestId("sort-price"));

    // Should now be 2 — sort change is a legitimate reason to recompute
    expect(getComputationCount()).toBe(2);
  });
});
