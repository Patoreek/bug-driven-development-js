# Hint 3 (Strong)

Create a class component `ErrorBoundary` with a `hasError` state. Implement `static getDerivedStateFromError()` to set `hasError: true`. Then wrap `AnalyticsWidget` with it:
```tsx
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
```
The `ErrorBoundary` should accept `fallback` and `children` props, and render `fallback` when `hasError` is `true`.
