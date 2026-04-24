import { useState, useEffect, useCallback, memo } from "react";

// Types
interface Position {
  x: number;
  y: number;
}

interface MouseTrackerProps {
  children: (position: Position) => React.ReactNode;
}

interface PositionLoggerProps {
  position: Position;
  label: string;
  onLog: (entry: string) => void;
}

// A "heavy" memoized child component
export const PositionLogger = memo(function PositionLogger({
  position,
  label,
  onLog,
}: PositionLoggerProps) {
  return (
    <div data-testid="position-logger">
      <p data-testid="position-display">
        {label}: ({position.x}, {position.y})
      </p>
      <button
        data-testid="log-btn"
        onClick={() => onLog(`${label}: (${position.x}, ${position.y})`)}
      >
        Log Position
      </button>
    </div>
  );
});

// Mouse tracker using children-as-function pattern
export function MouseTracker({ children }: MouseTrackerProps) {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return <div data-testid="mouse-tracker">{children(position)}</div>;
}

// FIX:
// 1. handleLog uses functional setState to avoid stale closure over logEntries
// 2. handleLog is wrapped in useCallback with stable identity
// 3. The render prop still creates a new function, but PositionLogger's memo
//    now works correctly because onLog has a stable reference
export function App() {
  const [logEntries, setLogEntries] = useState<string[]>([]);
  const [clickCount, setClickCount] = useState(0);

  // FIX: Use functional setState — no dependency on `logEntries`
  const handleLog = useCallback((entry: string) => {
    setLogEntries((prev) => [...prev, entry]);
  }, []);

  return (
    <div>
      <h1>Mouse Position Tracker</h1>
      <button
        data-testid="counter-btn"
        onClick={() => setClickCount((c) => c + 1)}
      >
        Clicked: {clickCount}
      </button>
      <MouseTracker>
        {(position) => (
          <PositionLogger
            position={position}
            label="Mouse"
            onLog={handleLog}
          />
        )}
      </MouseTracker>
      <div data-testid="log-entries">
        <h3>Log ({logEntries.length} entries)</h3>
        <ul>
          {logEntries.map((entry, i) => (
            <li key={i} data-testid="log-entry">
              {entry}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
