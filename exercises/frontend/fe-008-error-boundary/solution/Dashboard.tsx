import { Component, useState, type ReactNode } from "react";

// Error Boundary class component
interface ErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("ErrorBoundary caught:", error.message);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

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
    throw new Error("Analytics data is unavailable");
  }

  return (
    <div data-testid="analytics-widget">
      <h3>Analytics</h3>
      <p>Visits: {data.visits.toLocaleString()}</p>
    </div>
  );
}

export function Dashboard({ analyticsData }: { analyticsData: { visits: number } | null }) {
  const [showAnalytics, setShowAnalytics] = useState(true);

  return (
    <div data-testid="dashboard">
      <h2>Dashboard</h2>
      <div>
        <RevenueWidget />
        <UsersWidget />
        {showAnalytics && (
          <ErrorBoundary
            fallback={
              <div data-testid="analytics-error">
                <h3>Analytics</h3>
                <p>Unable to load analytics data.</p>
              </div>
            }
          >
            <AnalyticsWidget data={analyticsData} />
          </ErrorBoundary>
        )}
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
