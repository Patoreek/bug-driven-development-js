import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Dashboard } from "../Dashboard";

describe("Dashboard", () => {
  // Suppress React error boundary console.error noise in test output
  const originalError = console.error;
  beforeAll(() => {
    console.error = (...args: unknown[]) => {
      const msg = typeof args[0] === "string" ? args[0] : "";
      if (
        msg.includes("Error: Uncaught") ||
        msg.includes("The above error occurred") ||
        msg.includes("ErrorBoundary") ||
        msg.includes("Analytics data is unavailable")
      ) {
        return;
      }
      originalError.call(console, ...args);
    };
  });
  afterAll(() => {
    console.error = originalError;
  });

  it("renders all widgets when analytics data is valid", () => {
    render(<Dashboard analyticsData={{ visits: 5000 }} />);

    expect(screen.getByTestId("dashboard")).toBeInTheDocument();
    expect(screen.getByTestId("revenue-widget")).toBeInTheDocument();
    expect(screen.getByTestId("users-widget")).toBeInTheDocument();
    expect(screen.getByTestId("analytics-widget")).toBeInTheDocument();
    expect(screen.getByText("Visits: 5,000")).toBeInTheDocument();
  });

  it("shows fallback for analytics but keeps other widgets when data is null", () => {
    render(<Dashboard analyticsData={null} />);

    // Dashboard itself should still be visible
    expect(screen.getByTestId("dashboard")).toBeInTheDocument();

    // Other widgets should still work
    expect(screen.getByTestId("revenue-widget")).toBeInTheDocument();
    expect(screen.getByTestId("users-widget")).toBeInTheDocument();

    // Analytics should show error fallback, not crash the whole page
    expect(screen.queryByTestId("analytics-widget")).not.toBeInTheDocument();
    expect(screen.getByTestId("analytics-error")).toBeInTheDocument();
    expect(screen.getByText("Unable to load analytics data.")).toBeInTheDocument();
  });

  it("does not crash the dashboard when analytics widget throws", () => {
    // This is the key test — without error boundary, the entire render crashes
    expect(() => {
      render(<Dashboard analyticsData={null} />);
    }).not.toThrow();
  });

  it("can hide and show analytics section", async () => {
    render(<Dashboard analyticsData={{ visits: 3000 }} />);
    const user = userEvent.setup();

    expect(screen.getByTestId("analytics-widget")).toBeInTheDocument();

    await user.click(screen.getByTestId("toggle-analytics"));
    expect(screen.queryByTestId("analytics-widget")).not.toBeInTheDocument();

    await user.click(screen.getByTestId("toggle-analytics"));
    expect(screen.getByTestId("analytics-widget")).toBeInTheDocument();
  });
});
