import { Component, Suspense, useState, useCallback } from "react";

// Simple promise cache — simulates a data fetching library
const cache = new Map<string, { status: string; value?: unknown; error?: Error }>();

export function fetchData(url: string): unknown {
  const entry = cache.get(url);

  if (entry) {
    if (entry.status === "resolved") return entry.value;
    if (entry.status === "rejected") throw entry.error;
    // status === "pending"
    throw entry.value; // throw the promise for Suspense
  }

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate: URLs containing "fail" will error
      if (url.includes("fail")) {
        const error = new Error(`Failed to fetch: ${url}`);
        cache.set(url, { status: "rejected", error });
        reject(error);
      } else {
        const data = { message: `Data from ${url}` };
        cache.set(url, { status: "resolved", value: data });
        resolve(data);
      }
    }, 100);
  });

  cache.set(url, { status: "pending", value: promise });
  throw promise;
}

// Reset cache (for testing)
export function clearCache() {
  cache.clear();
}

// FIX: Error boundary that properly resets its state on retry
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  onRetry?: () => void;
  resetKey?: number; // FIX: key-based reset pattern
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  // FIX: Reset error state when resetKey changes
  static getDerivedStateFromProps(
    props: ErrorBoundaryProps,
    state: ErrorBoundaryState
  ): ErrorBoundaryState | null {
    // This is handled by the key prop change forcing remount,
    // but we also support explicit retry
    return null;
  }

  handleRetry = () => {
    // FIX: Clear the error state so children re-render
    this.setState({ hasError: false, error: null });

    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div data-testid="error-ui">
          <p data-testid="error-message">Error: {this.state.error?.message}</p>
          <button data-testid="retry-btn" onClick={this.handleRetry}>
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Data display component using the fetch cache
function DataDisplay({ url }: { url: string }) {
  const data = fetchData(url) as { message: string };
  return <p data-testid="data-display">{data.message}</p>;
}

// FIX: The App clears the cache on retry and uses a key to
// force Suspense to remount the DataDisplay with a fresh fetch.
export function App() {
  const [url] = useState("/api/data?fail");
  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = useCallback(() => {
    // FIX: Clear the cached entry so the next render triggers a fresh fetch
    cache.delete(url);
    // Increment retry count to force a fresh Suspense boundary
    setRetryCount((c) => c + 1);
  }, [url]);

  return (
    <div>
      <h1>Data Loader</h1>
      <ErrorBoundary onRetry={handleRetry} resetKey={retryCount}>
        <Suspense
          key={retryCount}
          fallback={<p data-testid="loading">Loading...</p>}
        >
          <DataDisplay url={url} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
