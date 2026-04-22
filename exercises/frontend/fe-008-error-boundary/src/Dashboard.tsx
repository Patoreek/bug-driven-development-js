import { useState } from "react";

// This widget works fine
function RevenueWidget() {
  return (
    <div data-testid="revenue-widget">
      <h3>Revenue</h3>
      <p>$42,389.00</p>
    </div>
  );
}

// This widget works fine
function UsersWidget() {
  return (
    <div data-testid="users-widget">
      <h3>Active Users</h3>
      <p>1,247</p>
    </div>
  );
}

// This widget can throw when data is malformed
function AnalyticsWidget({ data }: { data: { visits: number } | null }) {
  if (!data) {
    // Simulates a crash when receiving bad data
    throw new Error("Analytics data is unavailable");
  }

  return (
    <div data-testid="analytics-widget">
      <h3>Analytics</h3>
      <p>Visits: {data.visits.toLocaleString()}</p>
    </div>
  );
}

// BUG: No error boundary — if AnalyticsWidget throws, the entire Dashboard crashes
export function Dashboard({ analyticsData }: { analyticsData: { visits: number } | null }) {
  const [showAnalytics, setShowAnalytics] = useState(true);

  return (
    <div data-testid="dashboard">
      <h2>Dashboard</h2>
      <div>
        <RevenueWidget />
        <UsersWidget />
        {showAnalytics && <AnalyticsWidget data={analyticsData} />}
      </div>
      <button
        data-testid="toggle-analytics"
        onClick={() => setShowAnalytics((s) => !s)}
      >
        {showAnalytics ? "Hide Analytics" : "Show Analytics"}
      </button>
    </div>
  );
}
