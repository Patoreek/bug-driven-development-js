# Hint 2 (Medium)

**Client-side:** Use `useFormStatus()` from `react-dom`. It returns `{ pending }` — use it to disable the button and show "Placing Order..." text. Remember: `useFormStatus` must be in a **child component** of the `<form>`, not the same component.

**Server-side:** Add a hidden `<input name="idempotencyKey">` with a unique value (e.g., `useId()` + `Date.now()`). In `submitOrder`, check if you've seen that key before — if so, return the original order instead of creating a new one.
