import { createContext, useContext, useState, type ReactNode } from "react";

interface AppContextValue {
  user: string;
  theme: "light" | "dark";
  notificationCount: number;
  setTheme: (theme: "light" | "dark") => void;
  clearNotifications: () => void;
  addNotification: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [notificationCount, setNotificationCount] = useState(5);

  const clearNotifications = () => setNotificationCount(0);
  const addNotification = () => setNotificationCount((n) => n + 1);

  // BUG: New object created every render — all consumers re-render on any state change
  const value: AppContextValue = {
    user: "Jane Smith",
    theme,
    notificationCount,
    setTheme,
    clearNotifications,
    addNotification,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}

// Track render counts
let themeDisplayRenders = 0;
let notificationDisplayRenders = 0;

export function getThemeDisplayRenders() {
  return themeDisplayRenders;
}
export function getNotificationDisplayRenders() {
  return notificationDisplayRenders;
}
export function resetRenderCounts() {
  themeDisplayRenders = 0;
  notificationDisplayRenders = 0;
}

export function ThemeDisplay() {
  const { theme, setTheme } = useAppContext();
  themeDisplayRenders++;

  return (
    <div data-testid="theme-display">
      <p>Current theme: {theme}</p>
      <button
        data-testid="toggle-theme"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        Toggle Theme
      </button>
    </div>
  );
}

export function NotificationBadge() {
  const { notificationCount, clearNotifications, addNotification } = useAppContext();
  notificationDisplayRenders++;

  return (
    <div data-testid="notification-badge">
      <p>Notifications: {notificationCount}</p>
      <button data-testid="clear-notifications" onClick={clearNotifications}>
        Clear
      </button>
      <button data-testid="add-notification" onClick={addNotification}>
        Add
      </button>
    </div>
  );
}

export function App() {
  return (
    <AppProvider>
      <ThemeDisplay />
      <NotificationBadge />
    </AppProvider>
  );
}
