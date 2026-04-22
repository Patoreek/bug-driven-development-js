import { lazy, Suspense, useState } from "react";

const LazyDashboard = lazy(() => import("./Dashboard"));

export function App() {
  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <div>
      <header>
        <h1>My App</h1>
        <nav>
          <button onClick={() => setShowDashboard(false)}>Home</button>
          <button onClick={() => setShowDashboard(true)}>Dashboard</button>
        </nav>
      </header>
      <main>
        {showDashboard ? (
          <Suspense fallback={<div>Loading dashboard...</div>}>
            <LazyDashboard />
          </Suspense>
        ) : (
          <div data-testid="home">
            <h2>Welcome Home</h2>
            <p>Click Dashboard to view your stats.</p>
          </div>
        )}
      </main>
    </div>
  );
}
