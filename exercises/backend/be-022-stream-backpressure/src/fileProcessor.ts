import { Readable, Writable, Transform } from "stream";

// BUG: This file processor reads a large data source and writes to a destination.
// It ignores backpressure signals from the writable stream, causing unbounded
// memory growth when the producer is faster than the consumer.

export interface ProcessorOptions {
  transformFn?: (chunk: string) => string;
  highWaterMark?: number;
}

/**
 * Creates a readable stream that emits numbered lines.
 * Simulates a fast data source (e.g., reading a large file or database cursor).
 */
export function createDataSource(totalLines: number): Readable {
  let lineNumber = 0;

  return new Readable({
    highWaterMark: 16, // Small buffer to make backpressure visible
    read() {
      if (lineNumber >= totalLines) {
        this.push(null);
        return;
      }
      // Push multiple chunks without checking if the buffer is full
      // This is fine because Readable's internal buffering handles it
      this.push(`line-${lineNumber++}\n`);
    },
  });
}

/**
 * Creates a slow writable stream that simulates a bottleneck
 * (e.g., writing to a slow disk, network destination, or rate-limited API).
 */
export function createSlowDrain(
  delayMs: number,
  onData: (chunk: string) => void
): Writable {
  return new Writable({
    highWaterMark: 16, // Small buffer
    write(chunk, _encoding, callback) {
      onData(chunk.toString());
      // Simulate slow processing
      setTimeout(callback, delayMs);
    },
  });
}

/**
 * Creates a transform stream that applies a function to each chunk.
 */
export function createTransform(
  transformFn: (chunk: string) => string
): Transform {
  return new Transform({
    highWaterMark: 16,
    transform(chunk, _encoding, callback) {
      callback(null, transformFn(chunk.toString()));
    },
  });
}

/**
 * BUG: Processes data by manually reading and writing WITHOUT respecting
 * backpressure. When the writable stream's buffer is full, write() returns
 * false — but this code ignores that signal and keeps pushing data.
 *
 * This causes the writable stream's internal buffer to grow without bound,
 * leading to excessive memory usage and potential OOM crashes.
 */
export async function processData(
  source: Readable,
  destination: Writable,
  options?: ProcessorOptions
): Promise<{ linesProcessed: number; backpressureEvents: number }> {
  const transformFn = options?.transformFn ?? ((chunk: string) => chunk);
  let linesProcessed = 0;
  let backpressureEvents = 0;

  return new Promise((resolve, reject) => {
    source.on("data", (chunk: Buffer | string) => {
      const transformed = transformFn(chunk.toString());
      linesProcessed++;

      // BUG: Ignoring the return value of write().
      // write() returns false when the internal buffer exceeds highWaterMark,
      // signaling that we should STOP reading until 'drain' fires.
      // By not pausing, we flood the writable buffer.
      destination.write(transformed);
    });

    source.on("end", () => {
      destination.end(() => {
        resolve({ linesProcessed, backpressureEvents });
      });
    });

    source.on("error", reject);
    destination.on("error", reject);
  });
}

/**
 * BUG: Pipeline alternative that also ignores backpressure.
 * Uses a manual loop with for-await instead of stream.pipeline().
 */
export async function processDataWithLoop(
  source: Readable,
  destination: Writable,
  options?: ProcessorOptions
): Promise<{ linesProcessed: number }> {
  const transformFn = options?.transformFn ?? ((chunk: string) => chunk);
  let linesProcessed = 0;

  // BUG: for-await-of on a readable stream auto-pauses the readable
  // when the JS event loop is blocked, but it does NOT respect the
  // writable stream's backpressure. We write without awaiting 'drain'.
  for await (const chunk of source) {
    const transformed = transformFn(chunk.toString());
    destination.write(transformed); // BUG: still ignoring write()'s return value
    linesProcessed++;
  }

  // BUG: Not properly ending the writable stream with a callback
  destination.end();

  return { linesProcessed };
}
