import { useCallback, useSyncExternalStore } from "react";
import { themeStore, type Theme } from "./ThemeStore";

// FIX: Use useSyncExternalStore to subscribe to the external store.
// This hook ensures the component always reads a consistent snapshot
// during render, preventing tearing in concurrent mode.

export function ThemeDisplay() {
  const theme = useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getTheme,
    themeStore.getTheme // server snapshot (SSR fallback)
  );

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

// A second component reading the same store — consistent via useSyncExternalStore
export function ThemeBadge() {
  const theme = useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getTheme,
    themeStore.getTheme
  );

  return (
    <span data-testid="theme-badge" className={`badge-${theme}`}>
      {theme}
    </span>
  );
}
