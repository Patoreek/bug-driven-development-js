import { render, screen, fireEvent, act } from "@testing-library/react";
import { App, PositionLogger } from "../MouseTracker";

describe("MouseTracker — Render Prop Closure", () => {
  it("renders the app with initial state", () => {
    render(<App />);
    expect(screen.getByText("Mouse Position Tracker")).toBeInTheDocument();
    expect(screen.getByTestId("position-display")).toHaveTextContent(
      "Mouse: (0, 0)"
    );
  });

  it("updates position on mouse move", () => {
    render(<App />);

    act(() => {
      window.dispatchEvent(
        new MouseEvent("mousemove", { clientX: 100, clientY: 200 })
      );
    });

    expect(screen.getByTestId("position-display")).toHaveTextContent(
      "Mouse: (100, 200)"
    );
  });

  it("logs a single entry correctly", () => {
    render(<App />);

    act(() => {
      window.dispatchEvent(
        new MouseEvent("mousemove", { clientX: 50, clientY: 75 })
      );
    });

    fireEvent.click(screen.getByTestId("log-btn"));

    expect(screen.getAllByTestId("log-entry")).toHaveLength(1);
    expect(screen.getByTestId("log-entry")).toHaveTextContent(
      "Mouse: (50, 75)"
    );
  });

  it("accumulates multiple log entries without losing any (stale closure bug)", () => {
    render(<App />);

    // Move to position 1 and log
    act(() => {
      window.dispatchEvent(
        new MouseEvent("mousemove", { clientX: 10, clientY: 20 })
      );
    });
    fireEvent.click(screen.getByTestId("log-btn"));

    // Move to position 2 and log
    act(() => {
      window.dispatchEvent(
        new MouseEvent("mousemove", { clientX: 30, clientY: 40 })
      );
    });
    fireEvent.click(screen.getByTestId("log-btn"));

    // Move to position 3 and log
    act(() => {
      window.dispatchEvent(
        new MouseEvent("mousemove", { clientX: 50, clientY: 60 })
      );
    });
    fireEvent.click(screen.getByTestId("log-btn"));

    // All 3 entries must be present — stale closure bug would lose earlier ones
    const entries = screen.getAllByTestId("log-entry");
    expect(entries).toHaveLength(3);
    expect(entries[0]).toHaveTextContent("Mouse: (10, 20)");
    expect(entries[1]).toHaveTextContent("Mouse: (30, 40)");
    expect(entries[2]).toHaveTextContent("Mouse: (50, 60)");
  });

  it("log entries survive unrelated re-renders (counter clicks)", () => {
    render(<App />);

    // Log a position
    act(() => {
      window.dispatchEvent(
        new MouseEvent("mousemove", { clientX: 100, clientY: 100 })
      );
    });
    fireEvent.click(screen.getByTestId("log-btn"));
    expect(screen.getAllByTestId("log-entry")).toHaveLength(1);

    // Click the unrelated counter (triggers re-render of App)
    fireEvent.click(screen.getByTestId("counter-btn"));
    fireEvent.click(screen.getByTestId("counter-btn"));

    // Log another position
    act(() => {
      window.dispatchEvent(
        new MouseEvent("mousemove", { clientX: 200, clientY: 200 })
      );
    });
    fireEvent.click(screen.getByTestId("log-btn"));

    // Both entries must be present — stale closure after re-render
    // would reset to only showing the latest entry
    const entries = screen.getAllByTestId("log-entry");
    expect(entries).toHaveLength(2);
    expect(entries[0]).toHaveTextContent("Mouse: (100, 100)");
    expect(entries[1]).toHaveTextContent("Mouse: (200, 200)");
  });

  it("counter button works independently of mouse tracking", () => {
    render(<App />);

    fireEvent.click(screen.getByTestId("counter-btn"));
    expect(screen.getByTestId("counter-btn")).toHaveTextContent("Clicked: 1");

    fireEvent.click(screen.getByTestId("counter-btn"));
    expect(screen.getByTestId("counter-btn")).toHaveTextContent("Clicked: 2");
  });

  it("shows the correct count in the log header", () => {
    render(<App />);

    expect(screen.getByText("Log (0 entries)")).toBeInTheDocument();

    act(() => {
      window.dispatchEvent(
        new MouseEvent("mousemove", { clientX: 5, clientY: 5 })
      );
    });
    fireEvent.click(screen.getByTestId("log-btn"));

    expect(screen.getByText("Log (1 entries)")).toBeInTheDocument();
  });
});
