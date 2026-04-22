import { debounce, createAutoSave } from "../Debouncer";

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

    debounced("hello");
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("hello");
  });

  it("should not call the function before the delay", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced("hello");

    vi.advanceTimersByTime(299);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should only call once for rapid calls", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 200);

    debounced("a");
    vi.advanceTimersByTime(50);
    debounced("b");
    vi.advanceTimersByTime(50);
    debounced("c");

    vi.advanceTimersByTime(200);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("c");
  });

  it("should cancel pending invocation", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced("hello");
    debounced.cancel();

    vi.advanceTimersByTime(300);
    expect(fn).not.toHaveBeenCalled();
  });

  it("should flush pending invocation immediately", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced("hello");
    debounced.flush();

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("hello");

    // Verify the scheduled timer was also cleared
    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe("createAutoSave", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should auto-save at intervals", () => {
    const saveFn = vi.fn();
    const autoSave = createAutoSave(saveFn, 1000);

    autoSave.update("draft 1");

    vi.advanceTimersByTime(1000);
    expect(saveFn).toHaveBeenCalledTimes(1);
    expect(saveFn).toHaveBeenCalledWith("draft 1");

    autoSave.stop();
  });

  it("should not save when no updates", () => {
    const saveFn = vi.fn();
    const autoSave = createAutoSave(saveFn, 1000);

    vi.advanceTimersByTime(1000);
    expect(saveFn).not.toHaveBeenCalled();

    autoSave.stop();
  });

  it("should stop saving when stopped", () => {
    const saveFn = vi.fn();
    const autoSave = createAutoSave(saveFn, 1000);

    autoSave.update("draft 1");
    autoSave.stop();

    vi.advanceTimersByTime(1000);
    expect(saveFn).not.toHaveBeenCalled();
  });

  it("should save only the latest data", () => {
    const saveFn = vi.fn();
    const autoSave = createAutoSave(saveFn, 1000);

    autoSave.update("draft 1");
    autoSave.update("draft 2");
    autoSave.update("draft 3");

    vi.advanceTimersByTime(1000);
    expect(saveFn).toHaveBeenCalledTimes(1);
    expect(saveFn).toHaveBeenCalledWith("draft 3");

    autoSave.stop();
  });
});
