# Solution: Streaming SSR

## The Bug

All three data fetches were awaited sequentially in the `Dashboard` component:

```tsx
const summary = await fetchSummary();       // 50ms
const chartData = await fetchChartData();   // 2000ms
const activity = await fetchActivityFeed(); // 3000ms
// Total: ~5050ms before ANY content appears
```

The entire page was blank until all three resolved because there were no Suspense boundaries to allow streaming.

## The Fix

1. Keep the fast fetch (`fetchSummary`) at the top level since it resolves quickly.
2. Move slow fetches into their own async wrapper components.
3. Wrap each slow section in a `<Suspense>` boundary with a loading fallback:

```tsx
async function ChartLoader() {
  const chartData = await fetchChartData();
  return <ChartSection data={chartData} />;
}

export async function Dashboard() {
  const summary = await fetchSummary();

  return (
    <main>
      <SummarySection data={summary} />
      <Suspense fallback={<LoadingSkeleton label="chart" />}>
        <ChartLoader />
      </Suspense>
      <Suspense fallback={<LoadingSkeleton label="activity" />}>
        <ActivityLoader />
      </Suspense>
    </main>
  );
}
```

Now the summary appears in ~50ms, the chart skeleton shows immediately and resolves after 2s, and the activity skeleton resolves after 3s.

## Key Takeaway

In Next.js App Router, `<Suspense>` boundaries enable streaming SSR. Fast content is sent immediately while slow sections show loading fallbacks. Move slow data fetches into separate async components and wrap them in Suspense.
