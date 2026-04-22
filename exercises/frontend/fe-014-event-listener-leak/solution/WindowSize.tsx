import { useState, useEffect } from "react";

interface WindowSize {
  width: number;
  height: number;
}

export function useWindowSize(): WindowSize {
  const [size, setSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return size;
}

export function WindowSizeDisplay() {
  const { width, height } = useWindowSize();

  const getBreakpoint = () => {
    if (width < 640) return "mobile";
    if (width < 1024) return "tablet";
    return "desktop";
  };

  return (
    <div data-testid="window-size-display">
      <p data-testid="dimensions">
        {width} x {height}
      </p>
      <p data-testid="breakpoint">Breakpoint: {getBreakpoint()}</p>
    </div>
  );
}
