import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import {
  OrderDetails,
  getFetchTimestamps,
  resetFetchTimestamps,
} from "../OrderDetails";

describe("OrderDetails", () => {
  beforeEach(() => {
    resetFetchTimestamps();
  });

  it("shows loading state initially", () => {
    render(<OrderDetails orderId="order-1" />);
    expect(screen.getByTestId("loading")).toHaveTextContent("Loading order details...");
  });

  it("renders order details after loading", async () => {
    render(<OrderDetails orderId="order-1" />);

    await waitFor(() => {
      expect(screen.getByTestId("order-details")).toBeInTheDocument();
    });

    expect(screen.getByTestId("order-info")).toHaveTextContent("Wireless Headphones");
    expect(screen.getByTestId("customer-info")).toHaveTextContent("Alice Johnson");
    expect(screen.getByTestId("shipping-info")).toHaveTextContent("In Transit");
  });

  it("loads faster than 3 sequential requests (parallelizes where possible)", async () => {
    render(<OrderDetails orderId="order-1" />);

    await waitFor(() => {
      expect(screen.getByTestId("order-details")).toBeInTheDocument();
    });

    const loadTimeText = screen.getByTestId("load-time").textContent || "";
    const loadTime = parseInt(loadTimeText.replace(/[^0-9]/g, ""), 10);

    // Three sequential 100ms requests = ~300ms
    // Optimized (order first, then customer+shipping in parallel) = ~200ms
    // Allow generous margin for CI but it should be well under 300ms
    expect(loadTime).toBeLessThan(280);
  });

  it("makes exactly 3 fetch calls", async () => {
    render(<OrderDetails orderId="order-1" />);

    await waitFor(() => {
      expect(screen.getByTestId("order-details")).toBeInTheDocument();
    });

    expect(getFetchTimestamps()).toHaveLength(3);
  });
});
