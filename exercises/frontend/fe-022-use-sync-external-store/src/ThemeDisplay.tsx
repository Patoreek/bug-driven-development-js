import { useState, useEffect, useCallback } from "react";
import { themeStore, type Theme } from "./ThemeStore";

// BUG: This component subscribes to the external store using useEffect + useState.
// This pattern causes tearing (showing stale data) during concurrent renders
// because useEffect runs AFTER render, not during it. The component can render
// with a stale value before the effect fires to sync it.

export function ThemeDisplay() {
  const [theme, setTheme] = useState<Theme>(themeStore.getTheme());

  useEffect(() => {
    // Subscribe to store changes
    const unsubscribe = themeStore.subscribe(() => {
      setTheme(themeStore.getTheme());
    });

    // BUG: There's a race here — if the store changed between the initial
    // useState and this effect running, we miss that update. We try to
    // sync it here but this still runs after render.
    setTheme(themeStore.getTheme());

    return unsubscribe;
  }, []);

  const handleToggle = useCallback(() => {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";
    themeStore.setTheme(nextTheme);
  }, [theme]);

  const handleSetTheme = useCallback((newTheme: Theme) => {
    themeStore.setTheme(newTheme);
  }, []);

  return (
    <div data-testid="theme-container" data-theme={theme}>
      <h2>Theme Settings</h2>
      <p data-testid="current-theme">Current theme: {theme}</p>
      <button onClick={handleToggle} data-testid="toggle-btn">
        Toggle Theme
      </button>
      <div>
        <button
          onClick={() => handleSetTheme("light")}
          data-testid="light-btn"
        >
          Light
        </button>
        <button onClick={() => handleSetTheme("dark")} data-testid="dark-btn">
          Dark
        </button>
        <button
          onClick={() => handleSetTheme("system")}
          data-testid="system-btn"
        >
          System
        </button>
      </div>
    </div>
  );
}

// A second component reading the same store — used to demonstrate tearing
export function ThemeBadge() {
  const [theme, setTheme] = useState<Theme>(themeStore.getTheme());

  useEffect(() => {
    const unsubscribe = themeStore.subscribe(() => {
      setTheme(themeStore.getTheme());
    });
    setTheme(themeStore.getTheme());
    return unsubscribe;
  }, []);

  return (
    <span data-testid="theme-badge" className={`badge-${theme}`}>
      {theme}
    </span>
  );
}
