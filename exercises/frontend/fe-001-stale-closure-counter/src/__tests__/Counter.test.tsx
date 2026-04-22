import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("increments count by 1 after delay", async () => {
    render(<Counter />);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    await user.click(screen.getByText("Increment"));

    act(() => {
      vi.advanceTimersByTime(600);
    });

    expect(screen.getByTestId("count-display")).toHaveTextContent("Count: 1");
  });

  it("increments correctly when clicked multiple times rapidly", async () => {
    render(<Counter />);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    // Click 3 times rapidly (before any timeout fires)
    await user.click(screen.getByText("Increment"));
    await user.click(screen.getByText("Increment"));
    await user.click(screen.getByText("Increment"));

    // Advance past all timeouts
    act(() => {
      vi.advanceTimersByTime(600);
    });

    expect(screen.getByTestId("count-display")).toHaveTextContent("Count: 3");
  });

  it("increments correctly when clicked 5 times rapidly", async () => {
    render(<Counter />);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    for (let i = 0; i < 5; i++) {
      await user.click(screen.getByText("Increment"));
    }

    act(() => {
      vi.advanceTimersByTime(600);
    });

    expect(screen.getByTestId("count-display")).toHaveTextContent("Count: 5");
  });

  it("resets count to 0", async () => {
    render(<Counter />);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    await user.click(screen.getByText("Increment"));

    act(() => {
      vi.advanceTimersByTime(600);
    });

    expect(screen.getByTestId("count-display")).toHaveTextContent("Count: 1");

    await user.click(screen.getByText("Reset"));
    expect(screen.getByTestId("count-display")).toHaveTextContent("Count: 0");
  });
});
