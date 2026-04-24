import { Component, Suspense, useState } from "react";

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

// BUG: This error boundary never resets its error state.
// Once hasError is true, it stays true forever — clicking "Retry"
// does nothing because the boundary still has the error in state.
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  onRetry?: () => void;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  handleRetry = () => {
    // BUG: Calls onRetry but NEVER clears the error state!
    // The boundary still shows the error UI because hasError is still true.
    if (this.props.onRetry) {
      this.props.onRetry();
    }
    // Missing: this.setState({ hasError: false, error: null });
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

// BUG: The App doesn't clear the promise cache on retry,
// so even if the error boundary were reset, Suspense would
// just re-throw the cached rejected promise immediately.
// Also, there's no key to force Suspense to remount DataDisplay.
export function App() {
  const [url] = useState("/api/data?fail");

  const handleRetry = () => {
    // BUG: Does not clear the cache entry for the failed URL.
    // The next render will find the cached rejected promise and
    // immediately throw the same error again.
    console.log("Retrying...");
  };

  return (
    <div>
      <h1>Data Loader</h1>
      <ErrorBoundary onRetry={handleRetry}>
        <Suspense fallback={<p data-testid="loading">Loading...</p>}>
          <DataDisplay url={url} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
