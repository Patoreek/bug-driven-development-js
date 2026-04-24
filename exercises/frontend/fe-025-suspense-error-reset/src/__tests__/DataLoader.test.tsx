import { render, screen, fireEvent, act } from "@testing-library/react";
import { App, ErrorBoundary, clearCache } from "../DataLoader";

describe("DataLoader — Suspense + Error Boundary Reset", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    clearCache();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows loading state initially", async () => {
    render(<App />);
    expect(screen.getByTestId("loading")).toHaveTextContent("Loading...");
  });

  it("shows error UI after failed fetch", async () => {
    render(<App />);

    // Advance past the simulated fetch delay
    await act(async () => {
      vi.advanceTimersByTime(200);
    });

    expect(screen.getByTestId("error-ui")).toBeInTheDocument();
    expect(screen.getByTestId("error-message")).toHaveTextContent(
      "Error: Failed to fetch"
    );
  });

  it("has a retry button in error state", async () => {
    render(<App />);

    await act(async () => {
      vi.advanceTimersByTime(200);
    });

    expect(screen.getByTestId("retry-btn")).toBeInTheDocument();
  });

  it("shows loading state again after clicking retry", async () => {
    render(<App />);

    // Wait for error
    await act(async () => {
      vi.advanceTimersByTime(200);
    });

    expect(screen.getByTestId("error-ui")).toBeInTheDocument();

    // Click retry — this is the key test!
    // In the buggy version, the error UI persists because:
    // 1. ErrorBoundary never clears hasError state
    // 2. The cache still has the rejected promise
    await act(async () => {
      fireEvent.click(screen.getByTestId("retry-btn"));
    });

    // After retry, we should see loading (Suspense fallback) again,
    // NOT the error UI
    expect(screen.queryByTestId("error-ui")).not.toBeInTheDocument();
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("retry triggers a fresh fetch (not cached error)", async () => {
    render(<App />);

    // Wait for error
    await act(async () => {
      vi.advanceTimersByTime(200);
    });

    expect(screen.getByTestId("error-ui")).toBeInTheDocument();

    // Click retry
    await act(async () => {
      fireEvent.click(screen.getByTestId("retry-btn"));
    });

    // Should be loading
    expect(screen.getByTestId("loading")).toBeInTheDocument();

    // The fetch runs again (another 100ms delay) — it will still fail
    // (because URL contains "fail"), but the point is it RE-FETCHED,
    // didn't just re-use the cached error
    await act(async () => {
      vi.advanceTimersByTime(200);
    });

    // Back to error state after re-fetch fails
    expect(screen.getByTestId("error-ui")).toBeInTheDocument();
  });

  it("ErrorBoundary clears its error state on retry", async () => {
    let retried = false;

    const TestChild = () => {
      if (!retried) {
        throw new Error("Test error");
      }
      return <p data-testid="child-content">Success!</p>;
    };

    render(
      <ErrorBoundary
        onRetry={() => {
          retried = true;
        }}
      >
        <TestChild />
      </ErrorBoundary>
    );

    // Should show error UI
    expect(screen.getByTestId("error-ui")).toBeInTheDocument();

    // Click retry
    fireEvent.click(screen.getByTestId("retry-btn"));

    // After retry, error boundary should have cleared its state,
    // and since retried is now true, the child should render
    expect(screen.getByTestId("child-content")).toHaveTextContent("Success!");
    expect(screen.queryByTestId("error-ui")).not.toBeInTheDocument();
  });
});
