# Solution: Lazy Loading Flash

## The Problem

The code used `React.lazy()` to import the Dashboard component but never wrapped it in a `<Suspense>` boundary:

```tsx
const LazyDashboard = lazy(() => import("./Dashboard"));

// Used directly without Suspense:
{showDashboard ? <LazyDashboard /> : <Home />}
```

When React encounters a lazy component that hasn't loaded yet, it "suspends" — it throws a Promise. Without a Suspense boundary to catch this, React has no fallback to show and either crashes or shows a blank screen.

## The Fix

Wrap the lazy component in `<Suspense>` with a meaningful fallback:

```tsx
import { lazy, Suspense, useState } from "react";

{showDashboard ? (
  <Suspense fallback={<div>Loading dashboard...</div>}>
    <LazyDashboard />
  </Suspense>
) : (
  <Home />
)}
```

## Key Takeaway

Every `React.lazy()` component needs a `<Suspense>` boundary somewhere above it in the tree. The fallback should be a meaningful loading state — a spinner, skeleton, or message — not just an empty div. Place the Suspense boundary as close to the lazy component as practical to minimize the area that gets replaced by the fallback.
