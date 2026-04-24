# Explanation: React Hook Tests

## Why the Bug Happens

The original tests treat a custom hook like a component. Since hooks can only be called inside React components, the developer created wrapper components that render hook values into the DOM. This is the pre-`renderHook` approach and has several problems:

### 1. Indirection through DOM
To read the hook's value, you have to find a DOM element and read its `textContent`. This adds a layer of indirection where bugs in the wrapper (not the hook) can cause test failures.

### 2. Wrapper-specific test logic
To call the hook's setter function, you have to interact with the wrapper's UI: type into an input, click a button. You're now testing the wrapper's event handling, not the hook.

### 3. Type-specific wrappers
Testing numbers requires `NumberTestComponent`. Testing objects would need yet another wrapper. Each value type needs its own component.

### 4. Incomplete coverage
Complex objects can't be meaningfully asserted through `textContent`. Cross-tab `StorageEvent` handling is hard to test through a wrapper. Error cases are awkward.

## The Fix

### Before (buggy)

```tsx
function TestComponent({ storageKey, initialValue }) {
  const [value, setValue, removeValue] = useLocalStorage(storageKey, initialValue);
  const [inputVal, setInputVal] = useState("");
  return (
    <div>
      <span data-testid="current-value">{value}</span>
      <input data-testid="input" value={inputVal} onChange={...} />
      <button data-testid="set-btn" onClick={() => setValue(inputVal)}>Set</button>
    </div>
  );
}

it("should update the value", () => {
  render(<TestComponent storageKey="key" initialValue="default" />);
  fireEvent.change(screen.getByTestId("input"), { target: { value: "new" } });
  fireEvent.click(screen.getByTestId("set-btn"));
  expect(screen.getByTestId("current-value").textContent).toBe("new");
});
```

### After (fixed)

```typescript
import { renderHook, act } from "@testing-library/react";

it("should update the value", () => {
  const { result } = renderHook(() => useLocalStorage("key", "default"));

  act(() => {
    result.current[1]("new");
  });

  expect(result.current[0]).toBe("new");
});
```

## Key Principles

1. **`renderHook` is purpose-built for hook testing**: It handles the React component wrapper internally
2. **`result.current` gives direct access**: No DOM queries, no testids, no textContent parsing
3. **`act()` wraps state updates**: Required for synchronous state updates, just like in component tests
4. **Type-agnostic**: The same pattern works for strings, numbers, objects, arrays -- no separate wrappers
5. **Better coverage**: You can easily test edge cases like corrupt JSON, storage events, and error handling

## Common Variations

1. **Hooks with context dependencies**: Pass a `wrapper` option to `renderHook` to provide context providers
2. **Hooks with async effects**: Use `waitFor` alongside `renderHook` for async state updates
3. **Hooks that return callbacks**: Call callbacks from `result.current` inside `act()`

## Interview Context

Hook testing comes up frequently in React interviews. Interviewers look for:
- Knowledge that `renderHook` exists and when to use it
- Understanding of `act()` and why it's needed
- Ability to test hooks without coupling to DOM output
- Awareness that `result.current` always reflects the latest return value (it's a ref)

## References

- [Testing Library: renderHook API](https://testing-library.com/docs/react-testing-library/api#renderhook)
- [Testing Library: act](https://testing-library.com/docs/react-testing-library/api#act)
- [React: Testing Custom Hooks](https://react.dev/reference/react/hooks)
