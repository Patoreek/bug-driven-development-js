import { useState, useCallback, useRef } from "react";

export function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  // FIX: useRef keeps a mutable reference that is always current
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleStart = useCallback(() => {
    if (isRunning) return;

    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
  }, [isRunning]);

  const handleStop = useCallback(() => {
    if (!isRunning) return;

    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  }, [isRunning]);

  const handleReset = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    setElapsed(0);
  }, []);

  return (
    <div>
      <h2>Stopwatch</h2>
      <p data-testid="elapsed">{elapsed}s</p>
      <p data-testid="status">{isRunning ? "Running" : "Stopped"}</p>
      <button data-testid="start-btn" onClick={handleStart} disabled={isRunning}>
        Start
      </button>
      <button data-testid="stop-btn" onClick={handleStop} disabled={!isRunning}>
        Stop
      </button>
      <button data-testid="reset-btn" onClick={handleReset}>
        Reset
      </button>
    </div>
  );
}
