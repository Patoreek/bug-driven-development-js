# Hint 3 (Strong)

1. Wrap `clearNotifications` and `addNotification` with `useCallback(..., [])`
2. Wrap the entire context value with `useMemo`:
   ```tsx
   const value = useMemo(() => ({
     user: "Jane Smith",
     theme,
     notificationCount,
     setTheme,
     clearNotifications,
     addNotification,
   }), [theme, notificationCount, clearNotifications, addNotification]);
   ```
