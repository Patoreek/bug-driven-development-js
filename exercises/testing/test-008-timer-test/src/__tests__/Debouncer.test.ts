import { debounce, createAutoSave } from "../Debouncer";

// BUG: These tests use real timers, causing them to either:
// 1. Use actual setTimeout/setInterval delays (slow + flaky)
// 2. Not wait long enough and check too early (assertions fail)
// 3. Not clean up timers, leaking into other tests

describe("debounce", () => {
  it("should call the function after the delay", async () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced("hello");

    // BUG: Checking immediately -- timer hasn't fired yet
    expect(fn).toHaveBeenCalledWith("hello");
  });

  it("should not call the function before the delay", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced("hello");

    // This assertion is correct -- but only by coincidence (synchronous check)
    // It doesn't actually prove the delay works because we never advance time
    expect(fn).not.toHaveBeenCalled();
  });

  it("should only call once for rapid calls", async () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 200);

    debounced("a");
    debounced("b");
    debounced("c");

    // BUG: Uses real setTimeout to wait, making test slow and flaky
    await new Promise((resolve) => setTimeout(resolve, 250));

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("c");
  });

  it("should cancel pending invocation", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced("hello");
    debounced.cancel();

    // BUG: Never advances time, so we can't verify the cancel actually prevented firing
    expect(fn).not.toHaveBeenCalled();
  });

  it("should flush pending invocation immediately", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced("hello");
    debounced.flush();

    // This happens to work because flush is synchronous,
    // but the test doesn't verify that the scheduled timer was cleared
    expect(fn).toHaveBeenCalledWith("hello");
  });
});

describe("createAutoSave", () => {
  it("should auto-save at intervals", async () => {
    const saveFn = vi.fn();
    const autoSave = createAutoSave(saveFn, 1000);

    autoSave.update("draft 1");

    // BUG: Uses real delay -- slow and flaky
    await new Promise((resolve) => setTimeout(resolve, 1100));

    expect(saveFn).toHaveBeenCalledWith("draft 1");

    // BUG: Timer is never stopped -- leaks into other tests
  });

  it("should not save when no updates", async () => {
    const saveFn = vi.fn();
    const autoSave = createAutoSave(saveFn, 1000);

    // BUG: Uses real delay
    await new Promise((resolve) => setTimeout(resolve, 1100));

    expect(saveFn).not.toHaveBeenCalled();

    // BUG: Timer is never stopped
  });

  it("should stop saving when stopped", async () => {
    const saveFn = vi.fn();
    const autoSave = createAutoSave(saveFn, 1000);

    autoSave.update("draft 1");
    autoSave.stop();

    // BUG: Uses real delay
    await new Promise((resolve) => setTimeout(resolve, 1100));

    expect(saveFn).not.toHaveBeenCalled();
  });
});
