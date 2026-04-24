# Explanation: Broken Debounce and Throttle

## Why the Bug Happens

### Debounce

The debounce function is supposed to delay execution until the user stops calling it for a specified period. The critical operation is **canceling the previous timer** before setting a new one:

```typescript
// Buggy: sets a new timer without clearing the old one
timerId = setTimeout(() => fn(...args), delay);

// Each call creates its own timer, so fn fires once per call (just delayed)
```

Without `clearTimeout(timerId)`, every single call schedules its own independent timer. If you call the debounced function 5 times, `fn` will fire 5 times (each after its own `delay`).

### Throttle

The throttle function gates execution using a boolean flag, but the flag is set to `true` and **never reset**:

```typescript
inThrottle = true;
// Missing: setTimeout(() => { inThrottle = false; }, limit);
```

After the first call, `inThrottle` stays `true` forever, so every subsequent call is ignored permanently.

## The Fix

### Debounce

Add `clearTimeout(timerId)` before setting the new timer:

```typescript
// Before (buggy)
timerId = setTimeout(() => fn(...args), delay);

// After (fixed)
clearTimeout(timerId);
timerId = setTimeout(() => fn(...args), delay);
```

### Throttle

Add a `setTimeout` to reset the flag after the limit:

```typescript
// Before (buggy)
inThrottle = true;

// After (fixed)
inThrottle = true;
setTimeout(() => {
  inThrottle = false;
}, limit);
```

## How Debounce and Throttle Differ

| | Debounce | Throttle |
|---|---|---|
| **When it fires** | After a pause in calls | At most once per interval |
| **Use case** | Search input, resize end | Scroll events, rate limiting |
| **First call** | Delayed | Immediate |
| **Rapid calls** | Only the last one fires | First fires, rest are dropped |

## Common Variations

1. **Leading vs trailing debounce**: Some implementations fire on the leading edge (immediately) and then suppress. The basic version fires on the trailing edge (after the delay).
2. **Losing `this` context**: In non-arrow-function implementations, failing to use `.call(this, ...args)` loses the execution context.
3. **Not forwarding arguments**: Capturing args in the closure but not passing them to the delayed call.
4. **Cancel method**: Production debounce implementations often include a `.cancel()` method to abort the pending call.

## Interview Context

Implementing debounce and throttle from scratch is a very common interview question. Interviewers look for:
- Understanding the difference between debounce and throttle
- Correct use of `clearTimeout` / `setTimeout`
- Proper argument forwarding
- Bonus: implementing a `cancel` method or leading-edge variant

## References

- [MDN: setTimeout()](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout)
- [MDN: clearTimeout()](https://developer.mozilla.org/en-US/docs/Web/API/clearTimeout)
