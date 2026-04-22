# Hint 1 (Mild)

When `AnalyticsWidget` throws an error, there is nothing to catch it during rendering. React unmounts the entire component tree. You need a way to catch render errors and show a fallback UI instead.
