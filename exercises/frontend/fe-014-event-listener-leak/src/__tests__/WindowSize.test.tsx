import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { WindowSizeDisplay } from "../WindowSize";

describe("WindowSizeDisplay", () => {
  const originalInnerWidth = window.innerWidth;
  const originalInnerHeight = window.innerHeight;
  let addSpy: ReturnType<typeof vi.spyOn>;
  let removeSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    addSpy = vi.spyOn(window, "addEventListener");
    removeSpy = vi.spyOn(window, "removeEventListener");
    Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 1024 });
    Object.defineProperty(window, "innerHeight", { writable: true, configurable: true, value: 768 });
  });

  afterEach(() => {
    addSpy.mockRestore();
    removeSpy.mockRestore();
    Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: originalInnerWidth });
    Object.defineProperty(window, "innerHeight", { writable: true, configurable: true, value: originalInnerHeight });
  });

  it("displays the current window dimensions", () => {
    render(<WindowSizeDisplay />);
    expect(screen.getByTestId("dimensions")).toHaveTextContent("1024 x 768");
  });

  it("displays the correct breakpoint for desktop", () => {
    render(<WindowSizeDisplay />);
    expect(screen.getByTestId("breakpoint")).toHaveTextContent("Breakpoint: desktop");
  });

  it("updates dimensions on window resize", () => {
    render(<WindowSizeDisplay />);

    act(() => {
      Object.defineProperty(window, "innerWidth", { value: 500 });
      Object.defineProperty(window, "innerHeight", { value: 800 });
      window.dispatchEvent(new Event("resize"));
    });

    expect(screen.getByTestId("dimensions")).toHaveTextContent("500 x 800");
    expect(screen.getByTestId("breakpoint")).toHaveTextContent("Breakpoint: mobile");
  });

  it("adds a resize event listener on mount", () => {
    render(<WindowSizeDisplay />);
    const resizeCalls = addSpy.mock.calls.filter(
      (call) => call[0] === "resize"
    );
    expect(resizeCalls.length).toBeGreaterThanOrEqual(1);
  });

  it("removes the resize event listener on unmount", () => {
    const { unmount } = render(<WindowSizeDisplay />);

    // Get the handler that was added
    const addResizeCalls = addSpy.mock.calls.filter(
      (call) => call[0] === "resize"
    );
    const handler = addResizeCalls[addResizeCalls.length - 1]?.[1];
    expect(handler).toBeDefined();

    unmount();

    // The same handler should have been removed
    const removeResizeCalls = removeSpy.mock.calls.filter(
      (call) => call[0] === "resize"
    );
    const removedHandlers = removeResizeCalls.map((call) => call[1]);
    expect(removedHandlers).toContain(handler);
  });

  it("does not leak listeners across multiple mount/unmount cycles", () => {
    const { unmount: unmount1 } = render(<WindowSizeDisplay />);
    unmount1();

    const { unmount: unmount2 } = render(<WindowSizeDisplay />);
    unmount2();

    const { unmount: unmount3 } = render(<WindowSizeDisplay />);
    unmount3();

    // Each mount should have a corresponding unmount cleanup
    const addResizeCalls = addSpy.mock.calls.filter(
      (call) => call[0] === "resize"
    );
    const removeResizeCalls = removeSpy.mock.calls.filter(
      (call) => call[0] === "resize"
    );

    // At minimum, each mount's listener should be cleaned up
    expect(removeResizeCalls.length).toBeGreaterThanOrEqual(addResizeCalls.length - 0);
    // Each added handler should appear in the remove calls
    for (const addCall of addResizeCalls) {
      const handler = addCall[1];
      const wasRemoved = removeResizeCalls.some((rc) => rc[1] === handler);
      expect(wasRemoved).toBe(true);
    }
  });
});
