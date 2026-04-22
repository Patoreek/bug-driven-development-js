# Solution: Context Performance

## The Bug

The provider creates a new value object on every render:

```tsx
const value: AppContextValue = {
  user: "Jane Smith",
  theme,
  notificationCount,
  setTheme,
  clearNotifications,   // recreated every render
  addNotification,      // recreated every render
};
```

Since `value` is a new object reference each time, every consumer re-renders when ANY state in the provider changes. Changing notifications causes `ThemeDisplay` to re-render (even though theme didn't change), and vice versa.

Additionally, `clearNotifications` and `addNotification` are inline functions recreated every render, which contributes to the value instability.

## The Fix

1. **Stabilize callback functions** with `useCallback`:
   ```tsx
   const clearNotifications = useCallback(() => setNotificationCount(0), []);
   const addNotification = useCallback(() => setNotificationCount(n => n + 1), []);
   ```

2. **Memoize the context value** with `useMemo`:
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

Now the context value object only changes when `theme` or `notificationCount` actually changes, reducing unnecessary consumer re-renders.

## Note on Further Optimization

For even better performance, you could split into separate contexts (ThemeContext and NotificationContext). This way, changing notifications wouldn't trigger any re-render in theme consumers at all, regardless of memoization. However, `useMemo` is often sufficient and less architectural disruption.

## Key Takeaway

Always memoize context values when the provider has multiple state values. Without memoization, a new object reference is created on every render, forcing all consumers to re-render.
