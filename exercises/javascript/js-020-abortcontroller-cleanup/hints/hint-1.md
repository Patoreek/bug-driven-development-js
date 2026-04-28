# Hint 1 -- Mild

Look at each function and ask: is the `AbortSignal` actually being **used** where it needs to be?

- In `fetchWithTimeout`, where does the signal need to go for the abort to actually cancel the HTTP request?
- In `cancellableOperation`, what happens if `signal.aborted` is already `true` when the function is called? What happens if the signal is aborted while the operation is running?
- In `createCancellableDebounce`, when a new trigger comes in, what should happen to the previous controller?
- In `addAbortableEventListener`, `addEventListener` accepts an options object with a special property for automatic removal.
