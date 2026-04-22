# Hint 3 (Strong)

Create async wrapper components for the slow sections:

```tsx
async function ChartLoader() {
  const data = await fetchChartData();
  return <ChartSection data={data} />;
}
```

Then in Dashboard, wrap them in Suspense:

```tsx
<Suspense fallback={<LoadingSkeleton label="chart" />}>
  <ChartLoader />
</Suspense>
```

Keep `fetchSummary` as a direct await since it's fast (50ms).
