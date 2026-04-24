# Hint 2 -- Medium

**Debounce**: You need to call `clearTimeout(timerId)` before setting the new timeout. This cancels the previous pending call, so only the most recent call's timer survives.

**Throttle**: After setting `inThrottle = true`, you need a `setTimeout` that resets it to `false` after `limit` milliseconds. Without this, the throttle permanently blocks after the first call.
