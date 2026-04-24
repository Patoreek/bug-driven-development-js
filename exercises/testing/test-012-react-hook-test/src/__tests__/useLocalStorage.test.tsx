import { render, screen, fireEvent } from "@testing-library/react";
import { useState } from "react";
import { useLocalStorage } from "../useLocalStorage";

// BUG: Tests render a full wrapper component just to test the hook.
// This makes tests brittle, complex, and tests DOM output instead of
// hook return values. The wrapper component adds its own rendering
// concerns that obscure what's actually being tested.

// BUG: Custom wrapper component just to expose hook values in the DOM
function TestComponent({
  storageKey,
  initialValue,
}: {
  storageKey: string;
  initialValue: string;
}) {
  const [value, setValue, removeValue] = useLocalStorage<string>(
    storageKey,
    initialValue
  );
  const [inputVal, setInputVal] = useState("");

  return (
    <div>
      <span data-testid="current-value">{value}</span>
      <input
        data-testid="input"
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
      />
      <button
        data-testid="set-btn"
        onClick={() => {
          setValue(inputVal);
          setInputVal("");
        }}
      >
        Set Value
      </button>
      <button data-testid="remove-btn" onClick={removeValue}>
        Remove
      </button>
      <button
        data-testid="updater-btn"
        onClick={() => setValue((prev) => prev + "!")}
      >
        Add Exclamation
      </button>
    </div>
  );
}

// BUG: Another wrapper just for testing with numbers
function NumberTestComponent({
  storageKey,
  initialValue,
}: {
  storageKey: string;
  initialValue: number;
}) {
  const [value, setValue] = useLocalStorage<number>(storageKey, initialValue);

  return (
    <div>
      <span data-testid="number-value">{value}</span>
      <button data-testid="increment-btn" onClick={() => setValue((n) => n + 1)}>
        Increment
      </button>
    </div>
  );
}

describe("useLocalStorage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("should return the initial value when localStorage is empty", () => {
    // BUG: Renders a full component just to read a hook value
    render(<TestComponent storageKey="test-key" initialValue="default" />);

    // BUG: Asserts on DOM text content instead of the hook's return value
    const display = screen.getByTestId("current-value");
    expect(display.textContent).toBe("default");
  });

  it("should read existing value from localStorage", () => {
    window.localStorage.setItem("test-key", JSON.stringify("stored-value"));

    render(<TestComponent storageKey="test-key" initialValue="default" />);

    // BUG: Testing through DOM instead of directly checking hook return
    expect(screen.getByTestId("current-value").textContent).toBe(
      "stored-value"
    );
  });

  it("should update the value", () => {
    render(<TestComponent storageKey="test-key" initialValue="default" />);

    // BUG: Have to interact with the wrapper's input + button to set a value
    // This tests the wrapper component's event handling, not the hook
    const input = screen.getByTestId("input");
    const setBtn = screen.getByTestId("set-btn");

    fireEvent.change(input, { target: { value: "new-value" } });
    fireEvent.click(setBtn);

    expect(screen.getByTestId("current-value").textContent).toBe("new-value");
  });

  it("should persist to localStorage", () => {
    render(<TestComponent storageKey="test-key" initialValue="default" />);

    const input = screen.getByTestId("input");
    const setBtn = screen.getByTestId("set-btn");

    fireEvent.change(input, { target: { value: "persisted" } });
    fireEvent.click(setBtn);

    // BUG: The useEffect that syncs to localStorage is async --
    // this might check before the effect runs
    expect(window.localStorage.getItem("test-key")).toBe(
      JSON.stringify("persisted")
    );
  });

  it("should support updater function", () => {
    render(<TestComponent storageKey="test-key" initialValue="hello" />);

    // BUG: Tests the wrapper's button behavior, not the hook's updater
    const updaterBtn = screen.getByTestId("updater-btn");
    fireEvent.click(updaterBtn);

    expect(screen.getByTestId("current-value").textContent).toBe("hello!");
  });

  it("should remove value", () => {
    render(<TestComponent storageKey="test-key" initialValue="default" />);

    const input = screen.getByTestId("input");
    const setBtn = screen.getByTestId("set-btn");

    fireEvent.change(input, { target: { value: "to-remove" } });
    fireEvent.click(setBtn);

    fireEvent.click(screen.getByTestId("remove-btn"));

    // BUG: Checks DOM text, not hook return value
    expect(screen.getByTestId("current-value").textContent).toBe("default");
  });

  it("should work with number values", () => {
    // BUG: Needed an entirely separate wrapper component for numbers
    render(<NumberTestComponent storageKey="count" initialValue={0} />);

    expect(screen.getByTestId("number-value").textContent).toBe("0");

    fireEvent.click(screen.getByTestId("increment-btn"));
    expect(screen.getByTestId("number-value").textContent).toBe("1");

    fireEvent.click(screen.getByTestId("increment-btn"));
    expect(screen.getByTestId("number-value").textContent).toBe("2");
  });

  it("should handle complex object values", () => {
    // BUG: Can't easily test complex objects through DOM text content
    // This test is incomplete because the wrapper only handles strings
    render(<TestComponent storageKey="obj-key" initialValue="fallback" />);

    expect(screen.getByTestId("current-value").textContent).toBe("fallback");
  });

  it("should handle localStorage errors gracefully", () => {
    // BUG: Trying to test error handling through the wrapper is awkward
    const originalSetItem = window.localStorage.setItem;
    window.localStorage.setItem = () => {
      throw new Error("QuotaExceeded");
    };

    // BUG: No assertion on the hook's behavior -- just checks it doesn't crash
    render(<TestComponent storageKey="test-key" initialValue="default" />);
    expect(screen.getByTestId("current-value").textContent).toBe("default");

    window.localStorage.setItem = originalSetItem;
  });
});
