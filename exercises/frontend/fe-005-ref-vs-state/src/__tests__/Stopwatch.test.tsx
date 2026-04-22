import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Stopwatch } from "../Stopwatch";

describe("Stopwatch", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders with initial state", () => {
    render(<Stopwatch />);
    expect(screen.getByTestId("elapsed")).toHaveTextContent("0s");
    expect(screen.getByTestId("status")).toHaveTextContent("Stopped");
  });

  it("starts counting when Start is clicked", async () => {
    render(<Stopwatch />);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    await user.click(screen.getByTestId("start-btn"));
    expect(screen.getByTestId("status")).toHaveTextContent("Running");

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.getByTestId("elapsed")).toHaveTextContent("3s");
  });

  it("stops counting when Stop is clicked after multiple ticks", async () => {
    render(<Stopwatch />);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    await user.click(screen.getByTestId("start-btn"));

    // Let several ticks pass so state has updated multiple times
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByTestId("elapsed")).toHaveTextContent("5s");

    // Now stop
    await user.click(screen.getByTestId("stop-btn"));
    expect(screen.getByTestId("status")).toHaveTextContent("Stopped");

    // Advance more time — should NOT increase
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.getByTestId("elapsed")).toHaveTextContent("5s");
  });

  it("resets elapsed time and stops timer", async () => {
    render(<Stopwatch />);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    await user.click(screen.getByTestId("start-btn"));

    act(() => {
      vi.advanceTimersByTime(4000);
    });

    expect(screen.getByTestId("elapsed")).toHaveTextContent("4s");

    await user.click(screen.getByTestId("reset-btn"));

    expect(screen.getByTestId("elapsed")).toHaveTextContent("0s");
    expect(screen.getByTestId("status")).toHaveTextContent("Stopped");

    // Verify timer is actually stopped
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.getByTestId("elapsed")).toHaveTextContent("0s");
  });

  it("can start, stop, and restart correctly", async () => {
    render(<Stopwatch />);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    // Start
    await user.click(screen.getByTestId("start-btn"));
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByTestId("elapsed")).toHaveTextContent("3s");

    // Stop
    await user.click(screen.getByTestId("stop-btn"));
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByTestId("elapsed")).toHaveTextContent("3s"); // should not increase

    // Start again
    await user.click(screen.getByTestId("start-btn"));
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByTestId("elapsed")).toHaveTextContent("5s"); // continues from 3
  });
});
