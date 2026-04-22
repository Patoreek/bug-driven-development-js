import { render, screen } from "@testing-library/react";
import { Suspense } from "react";
import {
  Dashboard,
  SummarySection,
  ChartSection,
  ActivitySection,
  LoadingSkeleton,
  fetchSummary,
  fetchChartData,
  fetchActivityFeed,
} from "../Dashboard";

// Helper: read the source file to check for Suspense usage
async function readSourceFile(): Promise<string> {
  const fs = await import("fs");
  const path = await import("path");
  const filePath = path.resolve(__dirname, "../Dashboard.tsx");
  return fs.readFileSync(filePath, "utf-8");
}

describe("Dashboard streaming", () => {
  it("SummarySection renders revenue and user count", () => {
    render(<SummarySection data={{ revenue: 45200, users: 1823 }} />);
    expect(screen.getByTestId("revenue")).toHaveTextContent("$45,200");
    expect(screen.getByTestId("user-count")).toHaveTextContent("1,823");
  });

  it("ChartSection renders label-value pairs", () => {
    render(
      <ChartSection
        data={{ labels: ["Mon", "Tue"], values: [100, 200] }}
      />
    );
    expect(screen.getByTestId("chart-section")).toHaveTextContent("Mon: 100");
    expect(screen.getByTestId("chart-section")).toHaveTextContent("Tue: 200");
  });

  it("ActivitySection renders activity messages", () => {
    render(
      <ActivitySection
        data={[{ id: "1", message: "New user signed up" }]}
      />
    );
    expect(screen.getByTestId("activity-section")).toHaveTextContent(
      "New user signed up"
    );
  });

  it("LoadingSkeleton renders with correct label", () => {
    render(<LoadingSkeleton label="chart" />);
    expect(screen.getByTestId("loading-chart")).toHaveTextContent("Loading chart...");
  });

  it("Dashboard source uses Suspense boundaries around slow sections", async () => {
    const source = await readSourceFile();
    // Must have at least 2 Suspense wrappers (for chart and activity)
    const suspenseCount = (source.match(/<Suspense/g) || []).length;
    expect(suspenseCount).toBeGreaterThanOrEqual(2);
  });

  it("Dashboard source does NOT await chart or activity at top level", async () => {
    const source = await readSourceFile();
    // The Dashboard function should not have `await fetchChartData()` or `await fetchActivityFeed()`
    // directly (they should be in sub-components)
    const dashboardFn = source.slice(source.indexOf("export async function Dashboard"));
    // It's fine to await fetchSummary since it's fast, but chart and activity should be deferred
    expect(dashboardFn).not.toMatch(/await fetchChartData\(\)/);
    expect(dashboardFn).not.toMatch(/await fetchActivityFeed\(\)/);
  });

  it("Dashboard source wraps slow sections with loading fallbacks", async () => {
    const source = await readSourceFile();
    // Should use LoadingSkeleton or similar as Suspense fallback
    expect(source).toMatch(/fallback\s*=\s*\{/);
  });
});
