import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  fetchWithTimeout,
  cancellableOperation,
  createCancellableDebounce,
  addAbortableEventListener,
} from "../utils";

describe("fetchWithTimeout", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return the response when fetch completes within timeout", async () => {
    const mockResponse = new Response("ok", { status: 200 });
    const mockFetch = vi.fn().mockResolvedValue(mockResponse);

    const responsePromise = fetchWithTimeout("https://api.example.com", 5000, mockFetch);
    await vi.advanceTimersByTimeAsync(0);
    const response = await responsePromise;

    expect(response).toBe(mockResponse);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("should pass the abort signal to fetch", async () => {
    const mockFetch = vi.fn().mockResolvedValue(new Response("ok"));

    const responsePromise = fetchWithTimeout("https://api.example.com", 5000, mockFetch);
    await vi.advanceTimersByTimeAsync(0);
    await responsePromise;

    // The signal should be passed as part of the options
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.example.com",
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    );
  });

  it("should abort the request when timeout is exceeded", async () => {
    const abortError = new DOMException("The operation was aborted.", "AbortError");
    const mockFetch = vi.fn().mockImplementation(
      (_url: string, options?: { signal?: AbortSignal }) => {
        return new Promise((resolve, reject) => {
          if (options?.signal) {
            options.signal.addEventListener("abort", () => {
              reject(abortError);
            });
          }
        });
      }
    );

    const responsePromise = fetchWithTimeout("https://api.example.com", 3000, mockFetch);

    // Advance past the timeout
    await vi.advanceTimersByTimeAsync(3000);

    await expect(responsePromise).rejects.toThrow(/abort/i);
  });

  it("should clear the timeout when fetch succeeds", async () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");
    const mockFetch = vi.fn().mockResolvedValue(new Response("ok"));

    const responsePromise = fetchWithTimeout("https://api.example.com", 5000, mockFetch);
    await vi.advanceTimersByTimeAsync(0);
    await responsePromise;

    // clearTimeout should have been called to prevent the abort from firing later
    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
});

describe("cancellableOperation", () => {
  it("should complete when signal is not aborted", async () => {
    const controller = new AbortController();
    const operation = vi.fn().mockResolvedValue("done");

    const result = await cancellableOperation(operation, controller.signal);
    expect(result).toBe("done");
  });

  it("should reject immediately if signal is already aborted", async () => {
    const controller = new AbortController();
    controller.abort();

    const operation = vi.fn().mockResolvedValue("done");

    await expect(
      cancellableOperation(operation, controller.signal)
    ).rejects.toThrow(/abort/i);

    // Operation should not even start
    expect(operation).not.toHaveBeenCalled();
  });

  it("should reject when signal is aborted during operation", async () => {
    const controller = new AbortController();

    const operation = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          // Simulate long-running operation
          setTimeout(() => resolve("done"), 5000);
        })
    );

    const resultPromise = cancellableOperation(operation, controller.signal);

    // Abort during the operation
    controller.abort();

    await expect(resultPromise).rejects.toThrow(/abort/i);
  });

  it("should pass the signal to the operation function", async () => {
    const controller = new AbortController();
    const operation = vi.fn().mockResolvedValue("result");

    await cancellableOperation(operation, controller.signal);

    expect(operation).toHaveBeenCalledWith(controller.signal);
  });
});

describe("createCancellableDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should call the function after the delay", async () => {
    const fn = vi.fn().mockResolvedValue("result");
    const { trigger } = createCancellableDebounce(fn, 300);

    const resultPromise = trigger();
    await vi.advanceTimersByTimeAsync(300);
    const result = await resultPromise;

    expect(fn).toHaveBeenCalledTimes(1);
    expect(result).toBe("result");
  });

  it("should cancel the previous call when triggered again", async () => {
    const fn = vi.fn().mockResolvedValue("result");
    const { trigger } = createCancellableDebounce(fn, 300);

    const firstPromise = trigger();
    await vi.advanceTimersByTimeAsync(100);
    const secondPromise = trigger();

    await vi.advanceTimersByTimeAsync(300);

    const firstResult = await firstPromise;
    const secondResult = await secondPromise;

    // First call should have been cancelled (returns undefined)
    expect(firstResult).toBeUndefined();
    // Only the second call should have executed the function
    expect(secondResult).toBe("result");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should abort the signal of the previous call", async () => {
    const signals: AbortSignal[] = [];
    const fn = vi.fn().mockImplementation((signal: AbortSignal) => {
      signals.push(signal);
      return new Promise((resolve) => setTimeout(() => resolve("done"), 100));
    });

    const { trigger } = createCancellableDebounce(fn, 100);

    trigger();
    await vi.advanceTimersByTimeAsync(100);

    // Trigger again -- should abort the previous signal
    trigger();
    await vi.advanceTimersByTimeAsync(100);

    // The first signal should have been aborted
    expect(signals[0].aborted).toBe(true);
  });

  it("cancel() should prevent pending calls and abort the controller", async () => {
    const fn = vi.fn().mockResolvedValue("result");
    const { trigger, cancel } = createCancellableDebounce(fn, 300);

    const resultPromise = trigger();
    cancel();

    await vi.advanceTimersByTimeAsync(300);
    const result = await resultPromise;

    expect(fn).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });
});

describe("addAbortableEventListener", () => {
  it("should add an event listener", () => {
    const target = new EventTarget();
    const handler = vi.fn();
    const controller = new AbortController();

    addAbortableEventListener(target, "test", handler, controller.signal);
    target.dispatchEvent(new Event("test"));

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("should remove the event listener when signal is aborted", () => {
    const target = new EventTarget();
    const handler = vi.fn();
    const controller = new AbortController();

    addAbortableEventListener(target, "test", handler, controller.signal);

    target.dispatchEvent(new Event("test"));
    expect(handler).toHaveBeenCalledTimes(1);

    // Abort the signal
    controller.abort();

    // Dispatch again -- handler should NOT be called
    target.dispatchEvent(new Event("test"));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("should not add listener if signal is already aborted", () => {
    const target = new EventTarget();
    const handler = vi.fn();
    const controller = new AbortController();
    controller.abort();

    addAbortableEventListener(target, "test", handler, controller.signal);
    target.dispatchEvent(new Event("test"));

    expect(handler).not.toHaveBeenCalled();
  });
});
