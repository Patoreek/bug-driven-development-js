import { useState, useEffect, useCallback, memo } from "react";

// Types
interface Position {
  x: number;
  y: number;
}

interface MouseTrackerProps {
  render: (position: Position) => React.ReactNode;
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

// Mouse tracker using render prop pattern
export function MouseTracker({ render }: MouseTrackerProps) {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return <div data-testid="mouse-tracker">{render(position)}</div>;
}

// BUG: The App component creates an inline render prop that:
// 1. Creates a NEW function reference every render, defeating PositionLogger's memo
// 2. The onLog callback captures stale `logEntries` via closure
export function App() {
  const [logEntries, setLogEntries] = useState<string[]>([]);
  const [clickCount, setClickCount] = useState(0);

  // BUG: This callback closes over `logEntries` from this render.
  // Because it's used inside the inline render prop (which recreates
  // on every render anyway), the memo on PositionLogger is useless,
  // AND when the log button is clicked, it uses a stale logEntries array.
  const handleLog = (entry: string) => {
    setLogEntries([...logEntries, entry]);
  };

  return (
    <div>
      <h1>Mouse Position Tracker</h1>
      <button
        data-testid="counter-btn"
        onClick={() => setClickCount((c) => c + 1)}
      >
        Clicked: {clickCount}
      </button>
      <MouseTracker
        render={(position) => (
          <PositionLogger
            position={position}
            label="Mouse"
            onLog={handleLog}
          />
        )}
      />
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
