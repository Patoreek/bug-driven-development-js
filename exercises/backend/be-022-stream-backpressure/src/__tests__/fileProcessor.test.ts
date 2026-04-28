import {
  createDataSource,
  createSlowDrain,
  createTransform,
  processData,
  processDataWithLoop,
} from "../fileProcessor";
import { Writable } from "stream";

describe("Stream Backpressure", () => {
  describe("processData", () => {
    it("processes all lines from source to destination", async () => {
      const received: string[] = [];
      const source = createDataSource(10);
      const drain = createSlowDrain(1, (chunk) => received.push(chunk));

      const result = await processData(source, drain);

      expect(result.linesProcessed).toBe(10);
      expect(received.length).toBe(10);
    });

    it("applies transform function to each chunk", async () => {
      const received: string[] = [];
      const source = createDataSource(5);
      const drain = createSlowDrain(1, (chunk) => received.push(chunk));

      await processData(source, drain, {
        transformFn: (chunk) => chunk.toUpperCase(),
      });

      expect(received[0]).toContain("LINE-0");
    });

    it("respects backpressure when destination is slow", async () => {
      // Large source, slow drain -- backpressure MUST be applied.
      // Without backpressure handling, all chunks pile up in memory.
      const received: string[] = [];
      const source = createDataSource(100);
      const drain = createSlowDrain(5, (chunk) => received.push(chunk));

      const result = await processData(source, drain);

      // All lines must eventually be processed
      expect(result.linesProcessed).toBe(100);
      expect(received.length).toBe(100);

      // Backpressure should have been triggered at least once
      // because the drain is slower than the source
      expect(result.backpressureEvents).toBeGreaterThan(0);
    }, 15000);

    it("does not buffer more than highWaterMark chunks at once", async () => {
      // Track the maximum number of unprocessed writes sitting in the writable buffer.
      // If backpressure is respected, the buffer should stay bounded.
      let pendingWrites = 0;
      let maxPendingWrites = 0;

      const source = createDataSource(50);
      const drain = new Writable({
        highWaterMark: 16,
        write(chunk, _encoding, callback) {
          pendingWrites++;
          maxPendingWrites = Math.max(maxPendingWrites, pendingWrites);
          // Simulate slow write
          setTimeout(() => {
            pendingWrites--;
            callback();
          }, 10);
        },
      });

      await processData(source, drain);

      // With proper backpressure, pending writes should stay bounded.
      // Without it, all 50 writes pile up immediately.
      // The exact threshold depends on highWaterMark and chunk sizes,
      // but it should be far less than 50.
      expect(maxPendingWrites).toBeLessThan(30);
    }, 15000);
  });

  describe("processDataWithLoop", () => {
    it("processes all lines using the loop approach", async () => {
      const received: string[] = [];
      const source = createDataSource(10);
      const drain = createSlowDrain(1, (chunk) => received.push(chunk));

      const result = await processDataWithLoop(source, drain);

      expect(result.linesProcessed).toBe(10);
      expect(received.length).toBe(10);
    });

    it("applies transform function", async () => {
      const received: string[] = [];
      const source = createDataSource(5);
      const drain = createSlowDrain(1, (chunk) => received.push(chunk));

      await processDataWithLoop(source, drain, {
        transformFn: (chunk) => chunk.toUpperCase(),
      });

      expect(received[0]).toContain("LINE-0");
    });

    it("properly ends the writable stream", async () => {
      let finished = false;
      const source = createDataSource(5);
      const drain = new Writable({
        write(_chunk, _encoding, callback) {
          callback();
        },
        final(callback) {
          finished = true;
          callback();
        },
      });

      await processDataWithLoop(source, drain);

      expect(finished).toBe(true);
    });
  });

  describe("createTransform", () => {
    it("transforms chunks through the stream", (done) => {
      const source = createDataSource(3);
      const transform = createTransform((chunk) => chunk.toUpperCase());
      const received: string[] = [];

      const drain = new Writable({
        write(chunk, _encoding, callback) {
          received.push(chunk.toString());
          callback();
        },
      });

      drain.on("finish", () => {
        expect(received.length).toBe(3);
        expect(received[0]).toContain("LINE-0");
        done();
      });

      source.pipe(transform).pipe(drain);
    });
  });
});
