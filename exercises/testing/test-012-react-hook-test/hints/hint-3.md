# Hint 3 -- Strong

Delete the `TestComponent` and `NumberTestComponent` entirely. Replace every test with this pattern:

```typescript
import { renderHook, act } from "@testing-library/react";

it("should update the value", () => {
  const { result } = renderHook(() => useLocalStorage("test-key", "default"));

  act(() => {
    result.current[1]("new-value");
  });

  expect(result.current[0]).toBe("new-value");
});
```

For localStorage persistence:
```typescript
act(() => {
  result.current[1]("persisted");
});
expect(window.localStorage.getItem("test-key")).toBe(JSON.stringify("persisted"));
```

For cross-tab storage events:
```typescript
act(() => {
  window.dispatchEvent(new StorageEvent("storage", {
    key: "test-key",
    newValue: JSON.stringify("from-other-tab"),
  }));
});
expect(result.current[0]).toBe("from-other-tab");
```

For the remove function, it's `result.current[2]()`:
```typescript
act(() => { result.current[2](); });
expect(result.current[0]).toBe("default"); // back to initial
```
