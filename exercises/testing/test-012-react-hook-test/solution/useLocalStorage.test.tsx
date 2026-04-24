import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "../useLocalStorage";

// FIXED: Use renderHook to test the hook directly.
// No wrapper components, no DOM assertions -- just test the hook's API.

describe("useLocalStorage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("should return the initial value when localStorage is empty", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "default"));

    expect(result.current[0]).toBe("default");
  });

  it("should read existing value from localStorage", () => {
    window.localStorage.setItem("test-key", JSON.stringify("stored-value"));

    const { result } = renderHook(() =>
      useLocalStorage("test-key", "default")
    );

    expect(result.current[0]).toBe("stored-value");
  });

  it("should update the value", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "default"));

    act(() => {
      result.current[1]("new-value");
    });

    expect(result.current[0]).toBe("new-value");
  });

  it("should persist to localStorage", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "default"));

    act(() => {
      result.current[1]("persisted");
    });

    // After the state update and effect, localStorage should be synced
    expect(window.localStorage.getItem("test-key")).toBe(
      JSON.stringify("persisted")
    );
  });

  it("should support updater function", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "hello"));

    act(() => {
      result.current[1]((prev) => prev + "!");
    });

    expect(result.current[0]).toBe("hello!");

    act(() => {
      result.current[1]((prev) => prev + "!");
    });

    expect(result.current[0]).toBe("hello!!");
  });

  it("should remove value and reset to initial", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "default"));

    act(() => {
      result.current[1]("to-remove");
    });
    expect(result.current[0]).toBe("to-remove");

    act(() => {
      result.current[2](); // removeValue
    });

    expect(result.current[0]).toBe("default");
    expect(window.localStorage.getItem("test-key")).toBeNull();
  });

  it("should work with number values", () => {
    const { result } = renderHook(() => useLocalStorage("count", 0));

    expect(result.current[0]).toBe(0);

    act(() => {
      result.current[1]((n) => n + 1);
    });
    expect(result.current[0]).toBe(1);

    act(() => {
      result.current[1]((n) => n + 1);
    });
    expect(result.current[0]).toBe(2);
  });

  it("should handle complex object values", () => {
    const initialObj = { name: "test", items: [1, 2, 3] };
    const { result } = renderHook(() => useLocalStorage("obj-key", initialObj));

    expect(result.current[0]).toEqual({ name: "test", items: [1, 2, 3] });

    act(() => {
      result.current[1]({ name: "updated", items: [4, 5] });
    });

    expect(result.current[0]).toEqual({ name: "updated", items: [4, 5] });
    expect(JSON.parse(window.localStorage.getItem("obj-key")!)).toEqual({
      name: "updated",
      items: [4, 5],
    });
  });

  it("should handle localStorage errors gracefully", () => {
    const originalSetItem = window.localStorage.setItem;
    window.localStorage.setItem = () => {
      throw new Error("QuotaExceeded");
    };

    const { result } = renderHook(() => useLocalStorage("test-key", "default"));

    // Should still work in-memory even if localStorage throws
    expect(result.current[0]).toBe("default");

    act(() => {
      result.current[1]("new-value");
    });

    // Value should update in-memory even though persistence fails
    expect(result.current[0]).toBe("new-value");

    window.localStorage.setItem = originalSetItem;
  });

  it("should handle corrupt JSON in localStorage", () => {
    window.localStorage.setItem("test-key", "not-valid-json{{{");

    const { result } = renderHook(() =>
      useLocalStorage("test-key", "fallback")
    );

    // Should fall back to initial value when JSON parse fails
    expect(result.current[0]).toBe("fallback");
  });

  it("should respond to storage events from other tabs", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "default"));

    // Simulate a storage event from another tab
    act(() => {
      const event = new StorageEvent("storage", {
        key: "test-key",
        newValue: JSON.stringify("from-other-tab"),
      });
      window.dispatchEvent(event);
    });

    expect(result.current[0]).toBe("from-other-tab");
  });
});
