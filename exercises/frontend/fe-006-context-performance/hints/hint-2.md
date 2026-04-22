# Hint 2 (Medium)

You need to ensure the context value object keeps the same reference when its contents haven't changed. `useMemo` can help with this. But remember: the functions inside the value (`clearNotifications`, `addNotification`) are also recreated every render, so they need to be stabilized too.
