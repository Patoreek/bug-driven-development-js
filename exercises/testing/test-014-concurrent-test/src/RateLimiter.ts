export class RateLimiter {
  private timestamps: number[] = [];
  private readonly maxCalls: number;
  private readonly windowMs: number;

  constructor(maxCalls: number, windowMs: number) {
    this.maxCalls = maxCalls;
    this.windowMs = windowMs;
  }

  canCall(): boolean {
    const now = Date.now();
    // Remove timestamps outside the window
    this.timestamps = this.timestamps.filter(
      (ts) => now - ts < this.windowMs
    );
    return this.timestamps.length < this.maxCalls;
  }

  call(): boolean {
    if (!this.canCall()) {
      return false;
    }
    this.timestamps.push(Date.now());
    return true;
  }

  async callAsync<T>(fn: () => Promise<T>): Promise<T> {
    if (!this.canCall()) {
      throw new Error("Rate limit exceeded");
    }
    this.timestamps.push(Date.now());
    return fn();
  }

  getRemainingCalls(): number {
    const now = Date.now();
    this.timestamps = this.timestamps.filter(
      (ts) => now - ts < this.windowMs
    );
    return Math.max(0, this.maxCalls - this.timestamps.length);
  }

  getTimeUntilReset(): number {
    if (this.timestamps.length === 0) return 0;
    const now = Date.now();
    const oldestInWindow = this.timestamps.find(
      (ts) => now - ts < this.windowMs
    );
    if (!oldestInWindow) return 0;
    return this.windowMs - (now - oldestInWindow);
  }

  reset(): void {
    this.timestamps = [];
  }
}

export class AsyncQueue {
  private queue: Array<() => Promise<void>> = [];
  private running = 0;
  private readonly concurrency: number;

  constructor(concurrency: number) {
    this.concurrency = concurrency;
  }

  async add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const task = async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (err) {
          reject(err);
        } finally {
          this.running--;
          this.processNext();
        }
      };

      this.queue.push(task);
      this.processNext();
    });
  }

  private processNext(): void {
    while (this.running < this.concurrency && this.queue.length > 0) {
      const task = this.queue.shift()!;
      this.running++;
      task();
    }
  }

  get pending(): number {
    return this.queue.length;
  }

  get active(): number {
    return this.running;
  }
}
