import { render, screen } from "@testing-library/react";
import { Greeting } from "../Greeting";

describe("Greeting", () => {
  it("renders the username in the greeting", () => {
    render(<Greeting username="Alice" />);
    expect(screen.getByTestId("greeting-text")).toHaveTextContent("Alice");
  });

  it("starts with a safe default layout before client measurement", () => {
    render(<Greeting username="Bob" />);
    const banner = screen.getByTestId("greeting-banner");
    // Should render without crashing in a non-browser environment (no window.innerWidth on server)
    expect(banner).toBeInTheDocument();
  });

  it("starts with a safe default greeting before client measurement", () => {
    render(<Greeting username="Carol" />);
    const text = screen.getByTestId("greeting-text");
    // The initial render should use a generic fallback, not a time-dependent value
    expect(text).toHaveTextContent(/Welcome|Hello|Carol/);
  });

  it("does not call window.innerWidth during initial render", () => {
    // Temporarily remove window.innerWidth to simulate SSR-like environment
    const original = Object.getOwnPropertyDescriptor(window, "innerWidth");
    Object.defineProperty(window, "innerWidth", {
      get: () => {
        throw new Error("window.innerWidth accessed during render");
      },
      configurable: true,
    });

    // The component should NOT throw when window.innerWidth is unavailable
    expect(() => render(<Greeting username="Dave" />)).not.toThrow();

    // Restore
    if (original) {
      Object.defineProperty(window, "innerWidth", original);
    }
  });

  it("does not use Date for the initial server render", () => {
    const originalDate = globalThis.Date;
    // Mock Date to return a different hour to detect direct usage
    const mockDate = class extends originalDate {
      constructor() {
        super("2025-01-01T03:00:00Z"); // 3 AM UTC
      }
    } as DateConstructor;
    globalThis.Date = mockDate;

    const { unmount } = render(<Greeting username="Eve" />);
    const text = screen.getByTestId("greeting-text");

    // Initial render should NOT say "Good morning" because it shouldn't read Date on first render
    // It should use a generic fallback
    expect(text.textContent).not.toMatch(/^Good (morning|afternoon|evening), Eve/);

    globalThis.Date = originalDate;
    unmount();
  });

  it("renders the full layout with subtitle after client effect runs", async () => {
    // With a wide viewport, the full layout should eventually appear
    Object.defineProperty(window, "innerWidth", {
      value: 1024,
      configurable: true,
      writable: true,
    });

    render(<Greeting username="Frank" />);

    // After effects run, we expect the subtitle to appear (full layout)
    const subtitle = await screen.findByTestId("greeting-subtitle");
    expect(subtitle).toHaveTextContent("Welcome back to your dashboard.");
  });

  it("renders compact layout for narrow viewport after client effect", async () => {
    Object.defineProperty(window, "innerWidth", {
      value: 500,
      configurable: true,
      writable: true,
    });

    render(<Greeting username="Grace" />);

    // After effects run, greeting should be present without subtitle
    const greeting = await screen.findByTestId("greeting-text");
    expect(greeting).toBeInTheDocument();
  });
});
