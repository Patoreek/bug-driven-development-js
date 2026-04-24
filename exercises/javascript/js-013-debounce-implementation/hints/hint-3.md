# Hint 3 -- Strong

**Debounce fix** -- add one line before `setTimeout`:
```typescript
clearTimeout(timerId);
timerId = setTimeout(() => {
  fn(...args);
}, delay);
```

**Throttle fix** -- add a timer to reset the flag:
```typescript
if (!inThrottle) {
  fn(...args);
  inThrottle = true;
  setTimeout(() => {
    inThrottle = false;
  }, limit);
}
```
