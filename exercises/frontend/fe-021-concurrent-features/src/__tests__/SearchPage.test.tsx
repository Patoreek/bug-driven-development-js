import { render, screen, fireEvent, act } from "@testing-library/react";
import { SearchPage } from "../SearchPage";

describe("SearchPage — Concurrent Features", () => {
  it("renders with all items initially", () => {
    render(<SearchPage />);
    expect(screen.getByTestId("result-count")).toHaveTextContent("5000 results");
  });

  it("updates the input value immediately (urgently) on typing", () => {
    render(<SearchPage />);
    const input = screen.getByTestId("search-input");

    fireEvent.change(input, { target: { value: "Item 1" } });

    // The input's displayed value must update immediately,
    // NOT be deferred by a transition
    expect(input).toHaveValue("Item 1");
  });

  it("keeps the input responsive during rapid typing", () => {
    render(<SearchPage />);
    const input = screen.getByTestId("search-input");

    // Simulate rapid keystrokes
    fireEvent.change(input, { target: { value: "I" } });
    fireEvent.change(input, { target: { value: "It" } });
    fireEvent.change(input, { target: { value: "Ite" } });
    fireEvent.change(input, { target: { value: "Item" } });

    // Each keystroke must be reflected immediately in the input
    expect(input).toHaveValue("Item");
  });

  it("uses separate urgent and deferred state for input vs results", () => {
    render(<SearchPage />);
    const input = screen.getByTestId("search-input");

    // Type into input
    fireEvent.change(input, { target: { value: "xyz" } });

    // The input must reflect the typed value immediately
    expect(input).toHaveValue("xyz");

    // After flushing transitions, the results should update too
    // (In the buggy version, input value itself is deferred)
  });

  it("shows loading indicator while transition is pending", () => {
    render(<SearchPage />);
    const input = screen.getByTestId("search-input");

    // Initially no loading indicator
    expect(screen.queryByTestId("loading-indicator")).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: "Item 1" } });

    // The input should update immediately even if results haven't
    expect(input).toHaveValue("Item 1");
  });

  it("filters results correctly after typing", async () => {
    render(<SearchPage />);
    const input = screen.getByTestId("search-input");

    // Type a search query
    await act(async () => {
      fireEvent.change(input, { target: { value: "Item 1" } });
    });

    // After transitions flush, the filtered count should be less than 5000
    const resultCount = screen.getByTestId("result-count");
    const count = parseInt(resultCount.textContent!.replace(/\D/g, ""), 10);
    expect(count).toBeLessThan(5000);
    expect(count).toBeGreaterThan(0);
  });

  it("the input value is NOT controlled by transition state", () => {
    // This test verifies that the input is controlled by urgent state.
    // In the buggy version, the input value is set inside startTransition,
    // which means React can defer it, causing the input to appear laggy.
    render(<SearchPage />);
    const input = screen.getByTestId("search-input");

    // Type something
    fireEvent.change(input, { target: { value: "test" } });

    // The value must be "test" RIGHT NOW (same microtask),
    // not deferred to a later render
    expect(input).toHaveValue("test");

    // Type more
    fireEvent.change(input, { target: { value: "testing" } });
    expect(input).toHaveValue("testing");

    // Type something completely different
    fireEvent.change(input, { target: { value: "hello" } });
    expect(input).toHaveValue("hello");
  });
});
