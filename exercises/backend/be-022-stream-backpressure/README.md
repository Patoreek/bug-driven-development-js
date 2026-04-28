# Stream Backpressure: Flooding a Slow Consumer

**ID:** `be-022-stream-backpressure`  
**Difficulty:** ★★★★☆  
**Estimated Time:** 30 minutes  
**Tags:** `streams`, `backpressure`, `node.js`, `memory`, `pipeline`  
**Prerequisites:** None

---

## The Scenario

Your team built a data pipeline that reads large CSV exports from a database and writes them to a slow external storage service. In development it works fine with small files, but in production it processes millions of rows and the Node.js process balloons to 2 GB of memory before crashing with an OOM error. The monitoring dashboard shows memory climbing linearly even though streams are being used -- which should keep memory constant.

## The Bug

The `processData` function reads chunks from a `Readable` stream and writes them to a `Writable` stream. However, it ignores the return value of `destination.write()`. When `write()` returns `false`, it means the writable stream's internal buffer has exceeded its `highWaterMark` and the producer should pause until the `drain` event fires. By ignoring this signal, the code keeps pushing data into the writable buffer without limit, causing unbounded memory growth.

The `processDataWithLoop` function has the same problem -- it uses `for await...of` to read from the source but still calls `write()` without awaiting drain, and it does not properly end the writable stream.

## Your Task

1. In `processData`: check the return value of `destination.write()` -- when it returns `false`, pause the source and resume on the `drain` event
2. In `processDataWithLoop`: replace the manual loop with `stream.pipeline()` which handles backpressure automatically
3. Track backpressure events in the `processData` return value
4. Ensure the writable stream is properly ended with a callback
5. All tests must pass

## Files to Modify

| File | Description |
|------|-------------|
| `src/fileProcessor.ts` | Stream processing functions that ignore backpressure |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Node.js Streams: Backpressure](https://nodejs.org/en/learn/modules/backpressuring-in-streams) -- official guide on backpressure
- [stream.pipeline()](https://nodejs.org/api/stream.html#streampipelinesource-transforms-destination-callback) -- automatic backpressure and error handling
- [Writable.write() return value](https://nodejs.org/api/stream.html#writablewritechunk-encoding-callback) -- the false signal
