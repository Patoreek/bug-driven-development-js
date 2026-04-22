import { Suspense } from "react";

// --- Data fetching functions ---

export async function fetchSummary(): Promise<{ revenue: number; users: number }> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return { revenue: 45200, users: 1823 };
}

export async function fetchChartData(): Promise<{ labels: string[]; values: number[] }> {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    values: [120, 200, 150, 300, 250],
  };
}

export async function fetchActivityFeed(): Promise<Array<{ id: string; message: string }>> {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return [
    { id: "1", message: "New user signed up" },
    { id: "2", message: "Order #1234 completed" },
    { id: "3", message: "Payment received" },
  ];
}

// --- Sub-components ---

export function SummarySection({ data }: { data: { revenue: number; users: number } }) {
  return (
    <section data-testid="summary-section">
      <h2>Summary</h2>
      <p data-testid="revenue">Revenue: ${data.revenue.toLocaleString()}</p>
      <p data-testid="user-count">Users: {data.users.toLocaleString()}</p>
    </section>
  );
}

export function ChartSection({ data }: { data: { labels: string[]; values: number[] } }) {
  return (
    <section data-testid="chart-section">
      <h2>Weekly Chart</h2>
      <ul>
        {data.labels.map((label, i) => (
          <li key={label}>
            {label}: {data.values[i]}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ActivitySection({ data }: { data: Array<{ id: string; message: string }> }) {
  return (
    <section data-testid="activity-section">
      <h2>Recent Activity</h2>
      <ul>
        {data.map((item) => (
          <li key={item.id}>{item.message}</li>
        ))}
      </ul>
    </section>
  );
}

export function LoadingSkeleton({ label }: { label: string }) {
  return (
    <div data-testid={`loading-${label}`} role="status">
      Loading {label}...
    </div>
  );
}

// --- BUG: All fetches block the entire page ---

export async function Dashboard() {
  // All three awaited sequentially -- page shows nothing until ALL resolve
  const summary = await fetchSummary();
  const chartData = await fetchChartData();
  const activity = await fetchActivityFeed();

  return (
    <main data-testid="dashboard">
      <h1>Analytics Dashboard</h1>
      <SummarySection data={summary} />
      <ChartSection data={chartData} />
      <ActivitySection data={activity} />
    </main>
  );
}
