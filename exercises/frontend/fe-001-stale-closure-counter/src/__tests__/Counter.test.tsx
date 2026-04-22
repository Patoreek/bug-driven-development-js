import { render, screen, act, fireEvent } from "@testing-library/react";
import { Counter } from "../Counter";

describe("Counter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders with initial count of 0", () => {
    render(<Counter />);
    expect(screen.getByTestId("count-display")).toHaveTextContent("Count: 0");
  });

  it("increments count by 1 after delay", () => {
    render(<Counter />);

    fireEvent.click(screen.getByText("Increment"));

    act(() => {
      vi.advanceTimersByTime(600);
    });

    expect(screen.getByTestId("count-display")).toHaveTextContent("Count: 1");
  });

  it("increments correctly when clicked multiple times rapidly", () => {
    render(<Counter />);

    // Click 3 times rapidly (before any timeout fires)
    fireEvent.click(screen.getByText("Increment"));
    fireEvent.click(screen.getByText("Increment"));
    fireEvent.click(screen.getByText("Increment"));

    // Advance past all timeouts
    act(() => {
      vi.advanceTimersByTime(600);
    });

    // With the stale closure bug, count will be 1 instead of 3
    expect(screen.getByTestId("count-display")).toHaveTextContent("Count: 3");
  });

  it("increments correctly when clicked 5 times rapidly", () => {
    render(<Counter />);

    for (let i = 0; i < 5; i++) {
      fireEvent.click(screen.getByText("Increment"));
    }

    act(() => {
      vi.advanceTimersByTime(600);
    });

    // With the stale closure bug, count will be 1 instead of 5
    expect(screen.getByTestId("count-display")).toHaveTextContent("Count: 5");
  });

  it("resets count to 0", () => {
    render(<Counter />);

    fireEvent.click(screen.getByText("Increment"));

    act(() => {
      vi.advanceTimersByTime(600);
    });

    expect(screen.getByTestId("count-display")).toHaveTextContent("Count: 1");

    fireEvent.click(screen.getByText("Reset"));
    expect(screen.getByTestId("count-display")).toHaveTextContent("Count: 0");
  });
});
