// External store: a simple pub/sub theme manager
// This mimics patterns you'd see with vanilla stores, browser APIs, etc.

export type Theme = "light" | "dark" | "system";

type Listener = () => void;

let currentTheme: Theme = "light";
const listeners = new Set<Listener>();

export const themeStore = {
  getTheme(): Theme {
    return currentTheme;
  },

  setTheme(theme: Theme): void {
    currentTheme = theme;
    listeners.forEach((listener) => listener());
  },

  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  // Reset for testing
  _reset(): void {
    currentTheme = "light";
    listeners.clear();
  },
};
