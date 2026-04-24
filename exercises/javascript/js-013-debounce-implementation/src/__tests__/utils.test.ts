import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { debounce, throttle } from "../utils";

describe("debounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should call the function after the delay", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced();
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should only call once when called rapidly multiple times", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced();
    debounced();
    debounced();
    debounced();
    debounced();

    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should reset the timer on each call", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced();
    vi.advanceTimersByTime(200);
    expect(fn).not.toHaveBeenCalled();

    debounced(); // Reset timer
    vi.advanceTimersByTime(200);
    expect(fn).not.toHaveBeenCalled(); // Still waiting

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should forward the last call's arguments", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced("first");
    debounced("second");
    debounced("third");

    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledWith("third");
  });

  it("should allow a second call after the delay completes", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced("first");
    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("first");

    debounced("second");
    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith("second");
  });
});

describe("throttle", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should call the function immediately on first call", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 300);

    throttled();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should not call again within the time limit", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 300);

    throttled();
    throttled();
    throttled();

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should allow a call after the limit has passed", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 300);

    throttled();
    expect(fn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(300);

    throttled();
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("should forward arguments correctly", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 300);

    throttled("hello", 42);
    expect(fn).toHaveBeenCalledWith("hello", 42);
  });

  it("should allow multiple calls spaced apart", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled(); // Call 1 -- executes immediately
    expect(fn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);
    throttled(); // Call 2 -- limit expired, executes
    expect(fn).toHaveBeenCalledTimes(2);

    vi.advanceTimersByTime(100);
    throttled(); // Call 3 -- limit expired again, executes
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it("should ignore rapid calls within the limit window", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 300);

    throttled(); // Executes
    vi.advanceTimersByTime(50);
    throttled(); // Ignored
    vi.advanceTimersByTime(50);
    throttled(); // Ignored
    vi.advanceTimersByTime(50);
    throttled(); // Ignored

    expect(fn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(150); // Now 300ms total have passed
    throttled(); // Executes
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
