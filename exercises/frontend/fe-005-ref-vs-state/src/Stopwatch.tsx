import { useState, useCallback } from "react";

export function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  // BUG: Using useState for interval ID — this value goes stale in closures
  const [intervalId, setIntervalId] = useState<ReturnType<typeof setInterval> | null>(null);

  const handleStart = useCallback(() => {
    if (isRunning) return;

    setIsRunning(true);
    const id = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    setIntervalId(id);
  }, [isRunning]);

  const handleStop = useCallback(() => {
    if (!isRunning) return;

    // BUG: `intervalId` is captured from when useCallback was created,
    // which may be stale if the component re-rendered since start
    if (intervalId !== null) {
      clearInterval(intervalId);
    }
    setIntervalId(null);
    setIsRunning(false);
  }, [isRunning, intervalId]);

  const handleReset = useCallback(() => {
    if (intervalId !== null) {
      clearInterval(intervalId);
    }
    setIntervalId(null);
    setIsRunning(false);
    setElapsed(0);
  }, [intervalId]);

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
