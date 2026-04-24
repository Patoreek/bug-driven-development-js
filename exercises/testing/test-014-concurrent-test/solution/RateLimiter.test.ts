import { RateLimiter, AsyncQueue } from "../RateLimiter";

// FIXED: Use fake timers, per-test instances, and deterministic assertions.

describe("RateLimiter", () => {
  let limiter: RateLimiter;

  beforeEach(() => {
    vi.useFakeTimers();
    // Fresh instance per test -- no shared state
    limiter = new RateLimiter(3, 1000);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should allow calls within the limit", () => {
    expect(limiter.call()).toBe(true);
    expect(limiter.call()).toBe(true);
    expect(limiter.call()).toBe(true);
  });

  it("should reject calls over the limit", () => {
    // Use up the quota in THIS test
    limiter.call();
    limiter.call();
    limiter.call();

    expect(limiter.call()).toBe(false);
  });

  it("should reset after the time window", () => {
    // Use up the quota
    limiter.call();
    limiter.call();
    limiter.call();
    expect(limiter.call()).toBe(false);

    // Advance fake timers past the window
    vi.advanceTimersByTime(1000);

    // All calls should be available again
    expect(limiter.call()).toBe(true);
    expect(limiter.getRemainingCalls()).toBe(2);
  });

  it("should track remaining calls correctly", () => {
    expect(limiter.getRemainingCalls()).toBe(3);

    limiter.call();
    expect(limiter.getRemainingCalls()).toBe(2);

    limiter.call();
    expect(limiter.getRemainingCalls()).toBe(1);

    limiter.call();
    expect(limiter.getRemainingCalls()).toBe(0);

    // Advance past window
    vi.advanceTimersByTime(1000);
    expect(limiter.getRemainingCalls()).toBe(3);
  });

  it("should calculate time until reset", () => {
    limiter.call();
    limiter.call();

    // Advance 200ms into the window
    vi.advanceTimersByTime(200);

    const timeLeft = limiter.getTimeUntilReset();
    // Deterministic: 1000 - 200 = 800ms remaining
    expect(timeLeft).toBe(800);
  });

  it("should handle sliding window correctly", () => {
    limiter.call(); // t=0
    vi.advanceTimersByTime(400);
    limiter.call(); // t=400
    vi.advanceTimersByTime(400);
    limiter.call(); // t=800

    expect(limiter.call()).toBe(false); // At t=800, all 3 within window

    // Advance to t=1000 -- first call (t=0) drops out of window
    vi.advanceTimersByTime(200);
    expect(limiter.call()).toBe(true); // Now only 2 in window
  });

  it("should handle async calls", async () => {
    const results: number[] = [];

    const fn = async (n: number) => {
      results.push(n);
      return n;
    };

    await limiter.callAsync(() => fn(1));
    await limiter.callAsync(() => fn(2));
    await limiter.callAsync(() => fn(3));

    expect(results).toEqual([1, 2, 3]);

    // Fourth call should throw
    await expect(limiter.callAsync(() => fn(4))).rejects.toThrow(
      "Rate limit exceeded"
    );
    expect(results).toEqual([1, 2, 3]); // fn(4) never executed
  });

  it("should reset manually", () => {
    limiter.call();
    limiter.call();
    limiter.call();
    expect(limiter.getRemainingCalls()).toBe(0);

    limiter.reset();
    expect(limiter.getRemainingCalls()).toBe(3);
  });
});

describe("AsyncQueue", () => {
  let queue: AsyncQueue;

  beforeEach(() => {
    vi.useFakeTimers();
    // Fresh queue per test
    queue = new AsyncQueue(2);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should process tasks with concurrency limit", async () => {
    const order: string[] = [];

    const task = (id: string, delay: number) => async () => {
      order.push(`start-${id}`);
      await new Promise<void>((resolve) => setTimeout(resolve, delay));
      order.push(`end-${id}`);
    };

    const p1 = queue.add(task("a", 100));
    const p2 = queue.add(task("b", 50));
    const p3 = queue.add(task("c", 50));

    // Immediately: a and b start (concurrency=2), c queued
    expect(order).toEqual(["start-a", "start-b"]);
    expect(queue.active).toBe(2);
    expect(queue.pending).toBe(1);

    // Advance 50ms: b finishes, c starts
    await vi.advanceTimersByTimeAsync(50);
    expect(order).toEqual(["start-a", "start-b", "end-b", "start-c"]);

    // Advance another 50ms: a and c finish
    await vi.advanceTimersByTimeAsync(50);
    expect(order).toEqual([
      "start-a", "start-b", "end-b", "start-c", "end-a", "end-c",
    ]);

    await Promise.all([p1, p2, p3]);
  });

  it("should report pending and active counts", async () => {
    let resolveFirst!: () => void;
    let resolveSecond!: () => void;

    const p1 = queue.add(
      () => new Promise<void>((resolve) => { resolveFirst = resolve; })
    );
    const p2 = queue.add(
      () => new Promise<void>((resolve) => { resolveSecond = resolve; })
    );
    const p3 = queue.add(() => Promise.resolve());

    // Let microtasks settle
    await vi.advanceTimersByTimeAsync(0);

    expect(queue.active).toBe(2);
    expect(queue.pending).toBe(1);

    // Resolve first task
    resolveFirst();
    await vi.advanceTimersByTimeAsync(0);

    // p3 should have started now
    expect(queue.active).toBe(2);
    expect(queue.pending).toBe(0);

    resolveSecond();
    await vi.advanceTimersByTimeAsync(0);

    await Promise.all([p1, p2, p3]);
    expect(queue.active).toBe(0);
    expect(queue.pending).toBe(0);
  });
});
