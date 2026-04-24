# Hint 1 (Mild)

The `handleLog` function references `logEntries` directly. Every time this function runs, it sees the `logEntries` from the render when the function was created -- not the current value. Think about what pattern avoids closing over mutable state in setState calls.
