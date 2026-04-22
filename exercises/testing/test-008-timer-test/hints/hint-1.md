# Hint 1 (Mild)

Look at the first test -- it calls `debounced("hello")` and immediately checks if `fn` was called. But `debounce` uses `setTimeout`, so the function won't fire until 300ms later. In the "auto-save" tests, `new Promise(resolve => setTimeout(resolve, 1100))` waits in real time, which is slow and unreliable. Vitest provides a way to control time without waiting.
