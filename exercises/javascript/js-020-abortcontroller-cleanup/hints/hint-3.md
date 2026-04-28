# Hint 3 -- Strong

Here are all the fixes:

**fetchWithTimeout** -- pass signal and clear timeout:
```typescript
const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
try {
  const response = await fetchFn(url, { signal: controller.signal });
  clearTimeout(timeoutId);
  return response;
} catch (error) {
  clearTimeout(timeoutId);
  throw error;
}
```

**cancellableOperation** -- check aborted and race:
```typescript
if (signal.aborted) {
  throw new DOMException("The operation was aborted.", "AbortError");
}
return new Promise((resolve, reject) => {
  const onAbort = () => reject(new DOMException("...", "AbortError"));
  signal.addEventListener("abort", onAbort, { once: true });
  operation(signal).then(
    (result) => { signal.removeEventListener("abort", onAbort); resolve(result); },
    (error) => { signal.removeEventListener("abort", onAbort); reject(error); }
  );
});
```

**createCancellableDebounce** -- abort in cancel() and resolve pending promise:
```typescript
let pendingResolve: ((value: T | undefined) => void) | null = null;

function cancel() {
  if (timeoutId !== null) { clearTimeout(timeoutId); timeoutId = null; }
  if (controller) { controller.abort(); controller = null; }
  if (pendingResolve) { pendingResolve(undefined); pendingResolve = null; }
}

// In trigger(), store resolve:
return new Promise<T | undefined>((resolve) => {
  pendingResolve = resolve;
  timeoutId = setTimeout(async () => {
    pendingResolve = null;
    // ... rest of logic
  }, delayMs);
});
```

**addAbortableEventListener** -- guard and pass signal option:
```typescript
if (signal.aborted) return;
target.addEventListener(event, handler, { signal });
```
