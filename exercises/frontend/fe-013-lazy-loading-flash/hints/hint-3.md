Wrap `<LazyDashboard />` in a Suspense boundary:

```tsx
<Suspense fallback={<div>Loading dashboard...</div>}>
  <LazyDashboard />
</Suspense>
```

Make sure to import `Suspense` from `"react"`. The fallback text should include the word "loading" (case-insensitive) for the tests to detect it.
