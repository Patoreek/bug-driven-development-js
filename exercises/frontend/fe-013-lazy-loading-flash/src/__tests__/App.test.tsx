import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { App } from "../App";

describe("App with lazy-loaded Dashboard", () => {
  it("renders the home page by default", () => {
    render(<App />);
    expect(screen.getByTestId("home")).toBeInTheDocument();
    expect(screen.getByText("Welcome Home")).toBeInTheDocument();
  });

  it("shows a loading state when navigating to the dashboard", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText("Dashboard"));

    // Should show a loading indicator (fallback)
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("renders the dashboard after loading completes", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText("Dashboard"));

    await waitFor(() => {
      expect(screen.getByTestId("dashboard")).toBeInTheDocument();
    });

    expect(screen.getByText("Revenue")).toBeInTheDocument();
  });

  it("can navigate back to home from the dashboard", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText("Dashboard"));

    await waitFor(() => {
      expect(screen.getByTestId("dashboard")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Home"));
    expect(screen.getByTestId("home")).toBeInTheDocument();
    expect(screen.queryByTestId("dashboard")).not.toBeInTheDocument();
  });

  it("wraps the lazy component in a Suspense boundary", async () => {
    // This test verifies the app doesn't throw when rendering the lazy component.
    // Without Suspense, React.lazy will throw during render.
    const user = userEvent.setup();
    const { container } = render(<App />);

    await user.click(screen.getByText("Dashboard"));

    // The app should not crash — there should be either a loading state or the dashboard
    await waitFor(() => {
      const hasLoading = container.textContent?.toLowerCase().includes("loading");
      const hasDashboard = screen.queryByTestId("dashboard") !== null;
      expect(hasLoading || hasDashboard).toBe(true);
    });
  });
});
