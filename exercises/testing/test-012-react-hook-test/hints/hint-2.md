# Hint 2 -- Medium

Use `renderHook` from `@testing-library/react`:

```typescript
import { renderHook, act } from "@testing-library/react";

const { result } = renderHook(() => useLocalStorage("key", "initial"));

// Read the current value
expect(result.current[0]).toBe("initial");

// Update the value (must wrap in act)
act(() => {
  result.current[1]("new-value");
});

expect(result.current[0]).toBe("new-value");
```

Key points:
- `result.current` always reflects the latest hook return value
- State updates must be wrapped in `act()`
- You can test any value type (strings, numbers, objects) without changing the test pattern
- No wrapper components needed
