import { Readable, Writable, Transform, pipeline } from "stream";
import { promisify } from "util";

const pipelineAsync = promisify(pipeline);

export interface ProcessorOptions {
  transformFn?: (chunk: string) => string;
  highWaterMark?: number;
}

/**
 * Creates a readable stream that emits numbered lines.
 */
export function createDataSource(totalLines: number): Readable {
  let lineNumber = 0;

  return new Readable({
    highWaterMark: 16,
    read() {
      if (lineNumber >= totalLines) {
        this.push(null);
        return;
      }
      this.push(`line-${lineNumber++}\n`);
    },
  });
}

/**
 * Creates a slow writable stream that simulates a bottleneck.
 */
export function createSlowDrain(
  delayMs: number,
  onData: (chunk: string) => void
): Writable {
  return new Writable({
    highWaterMark: 16,
    write(chunk, _encoding, callback) {
      onData(chunk.toString());
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
 * FIX: Respects backpressure by pausing the source when write() returns false
 * and resuming when the 'drain' event fires.
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

      // FIX: Check the return value of write().
      // If it returns false, the writable buffer is full -- pause the source.
      const canContinue = destination.write(transformed);

      if (!canContinue) {
        backpressureEvents++;
        source.pause();

        // Resume reading only when the writable drains its buffer
        destination.once("drain", () => {
          source.resume();
        });
      }
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
 * FIX: Uses stream.pipeline() which handles backpressure automatically,
 * propagates errors, and cleans up streams properly.
 */
export async function processDataWithLoop(
  source: Readable,
  destination: Writable,
  options?: ProcessorOptions
): Promise<{ linesProcessed: number }> {
  const transformFn = options?.transformFn ?? ((chunk: string) => chunk);
  let linesProcessed = 0;

  const counter = new Transform({
    highWaterMark: 16,
    transform(chunk, _encoding, callback) {
      linesProcessed++;
      callback(null, transformFn(chunk.toString()));
    },
  });

  // FIX: pipeline() connects streams with proper backpressure handling,
  // error propagation, and cleanup.
  await pipelineAsync(source, counter, destination);

  return { linesProcessed };
}
