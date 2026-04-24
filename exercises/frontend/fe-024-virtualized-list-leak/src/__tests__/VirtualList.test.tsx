import { render, screen, fireEvent, act, cleanup } from "@testing-library/react";
import { VirtualList, Row } from "../VirtualList";

describe("VirtualList — Memory Leaks and Layout Thrashing", () => {
  const items = Array.from({ length: 1000 }, (_, i) => `Item ${i}`);

  it("renders only visible items (virtualization works)", () => {
    render(
      <VirtualList items={items} itemHeight={40} containerHeight={200} />
    );

    // With 200px container and 40px rows, we should see ~6 items (5 + 1 buffer)
    const container = screen.getByTestId("virtual-list-container");
    const renderedRows = container.querySelectorAll('[role="listitem"]');
    expect(renderedRows.length).toBeLessThanOrEqual(7);
    expect(renderedRows.length).toBeGreaterThanOrEqual(5);
  });

  it("renders the first items", () => {
    render(
      <VirtualList items={items} itemHeight={40} containerHeight={200} />
    );

    expect(screen.getByTestId("row-0")).toHaveTextContent("Item 0");
    expect(screen.getByTestId("row-1")).toHaveTextContent("Item 1");
  });

  // This test verifies that Row cleans up event listeners on unmount.
  // The buggy version will fail because addEventListener is called
  // but removeEventListener is never called.
  it("Row cleans up event listeners on unmount (no memory leak)", () => {
    const addSpy = vi.spyOn(HTMLElement.prototype, "addEventListener");
    const removeSpy = vi.spyOn(HTMLElement.prototype, "removeEventListener");

    const onVisible = vi.fn();

    const { unmount } = render(
      <Row
        content="Test"
        index={0}
        style={{ position: "absolute", top: 0 }}
        onVisible={onVisible}
      />
    );

    // addEventListener should have been called for "mouseenter"
    const addCalls = addSpy.mock.calls.filter(
      (call) => call[0] === "mouseenter"
    );
    expect(addCalls.length).toBeGreaterThanOrEqual(1);

    // Unmount the component
    unmount();

    // removeEventListener must be called with "mouseenter" — cleanup!
    const removeCalls = removeSpy.mock.calls.filter(
      (call) => call[0] === "mouseenter"
    );
    expect(removeCalls.length).toBeGreaterThanOrEqual(1);

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  // This test verifies passive scroll listeners are used
  it("uses passive scroll listener on the container", () => {
    const addSpy = vi.spyOn(HTMLElement.prototype, "addEventListener");

    render(
      <VirtualList items={items} itemHeight={40} containerHeight={200} />
    );

    // Find the scroll listener registration
    const scrollCalls = addSpy.mock.calls.filter(
      (call) => call[0] === "scroll"
    );
    expect(scrollCalls.length).toBeGreaterThanOrEqual(1);

    // The third argument should include { passive: true }
    const scrollOptions = scrollCalls[0][2];
    expect(scrollOptions).toEqual(
      expect.objectContaining({ passive: true })
    );

    addSpy.mockRestore();
  });

  // This test verifies layout thrashing is fixed:
  // DOM reads and writes should be batched separately
  it("batches DOM reads before writes (no layout thrashing)", () => {
    const operations: string[] = [];

    // Spy on offsetHeight (read) and style setter (write)
    const offsetHeightDescriptor = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "offsetHeight"
    );
    Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
      get() {
        operations.push("read");
        return 40;
      },
      configurable: true,
    });

    const originalSetProperty = CSSStyleDeclaration.prototype.setProperty;
    const minHeightDescriptor = Object.getOwnPropertyDescriptor(
      CSSStyleDeclaration.prototype,
      "minHeight"
    );

    Object.defineProperty(CSSStyleDeclaration.prototype, "minHeight", {
      set(value: string) {
        operations.push("write");
        originalSetProperty.call(this, "min-height", value);
      },
      configurable: true,
    });

    render(
      <VirtualList items={items} itemHeight={40} containerHeight={200} />
    );

    // Check that reads come before writes (no interleaving)
    if (operations.length > 1) {
      const firstWrite = operations.indexOf("write");
      const lastRead = operations.lastIndexOf("read");

      // All reads must come before any write
      if (firstWrite !== -1 && lastRead !== -1) {
        expect(lastRead).toBeLessThan(firstWrite);
      }
    }

    // Restore
    if (offsetHeightDescriptor) {
      Object.defineProperty(
        HTMLElement.prototype,
        "offsetHeight",
        offsetHeightDescriptor
      );
    }
    if (minHeightDescriptor) {
      Object.defineProperty(
        CSSStyleDeclaration.prototype,
        "minHeight",
        minHeightDescriptor
      );
    }
  });

  it("container has correct total height for scrolling", () => {
    render(
      <VirtualList items={items} itemHeight={40} containerHeight={200} />
    );

    const container = screen.getByTestId("virtual-list-container");
    const innerDiv = container.firstElementChild as HTMLElement;

    // Total height should be items.length * itemHeight
    expect(innerDiv.style.height).toBe(`${1000 * 40}px`);
  });

  it("rows are positioned absolutely at correct offsets", () => {
    render(
      <VirtualList items={items} itemHeight={40} containerHeight={200} />
    );

    const row0 = screen.getByTestId("row-0");
    const row1 = screen.getByTestId("row-1");

    expect(row0.style.top).toBe("0px");
    expect(row1.style.top).toBe("40px");
  });
});
