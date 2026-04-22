# Solution: Error Boundary

## The Bug

The `Dashboard` component renders an `AnalyticsWidget` that can throw during rendering when it receives `null` data. Without an error boundary, a thrown error during render causes React to unmount the entire component tree — the dashboard, revenue widget, users widget, and everything else all disappear:

```tsx
// No error boundary — if AnalyticsWidget throws, everything crashes
<div>
  <RevenueWidget />
  <UsersWidget />
  {showAnalytics && <AnalyticsWidget data={analyticsData} />}
</div>
```

## The Fix

Create an `ErrorBoundary` class component and wrap only the potentially failing widget:

```tsx
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
```

Then wrap the problematic widget:
```tsx
<ErrorBoundary fallback={<div data-testid="analytics-error">...</div>}>
  <AnalyticsWidget data={analyticsData} />
</ErrorBoundary>
```

Now when `AnalyticsWidget` throws, only that section is replaced with the fallback. The rest of the dashboard keeps working.

## Why Class Components?

Error boundaries are one of the few remaining use cases for class components in React. There is no hook equivalent for `getDerivedStateFromError` or `componentDidCatch`. Libraries like `react-error-boundary` provide a nicer API, but under the hood they also use a class component.

## Key Takeaway

Always wrap sections of your UI that might fail with error boundaries. The boundary should be placed at a granularity that makes sense — wrapping just the widget that can fail, not the entire app. This way, one failing component doesn't take down the entire page.
