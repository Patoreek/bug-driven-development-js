import { useState } from "react";

const DELAY_MS = 500;

export function Counter() {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setTimeout(() => {
      setCount((prev) => prev + 1);
    }, DELAY_MS);
  };

  const handleReset = () => {
    setCount(0);
  };

  return (
    <div>
      <h2>Package Counter</h2>
      <p data-testid="count-display">Count: {count}</p>
      <button onClick={handleIncrement}>Increment</button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
}
