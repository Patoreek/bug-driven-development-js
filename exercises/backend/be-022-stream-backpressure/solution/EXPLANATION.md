# Solution: Stream Backpressure -- Flooding a Slow Consumer

## The Problem

The buggy code reads from a fast source and writes to a slow destination, ignoring the backpressure signal:

```typescript
source.on("data", (chunk) => {
  const transformed = transformFn(chunk.toString());
  // BUG: ignoring the return value!
  destination.write(transformed);
});
```

`Writable.write()` returns `false` when its internal buffer exceeds `highWaterMark`, signaling that the producer should stop sending data. By ignoring this, every chunk piles up in the writable's buffer, growing memory linearly with input size. For a 10 million-line file, this means the entire file ends up buffered in memory -- defeating the purpose of streams.

## The Fix

### processData -- manual backpressure

```typescript
source.on("data", (chunk) => {
  const transformed = transformFn(chunk.toString());
  linesProcessed++;

  const canContinue = destination.write(transformed);

  if (!canContinue) {
    backpressureEvents++;
    source.pause();                              // Stop reading
    destination.once("drain", () => {
      source.resume();                           // Resume when buffer drains
    });
  }
});
```

Three changes:
1. **Save the return value** of `write()` -- it is `false` when the buffer is full
2. **Pause the source** to stop the `data` events from firing
3. **Resume on `drain`** -- the writable emits `drain` when its buffer drops below `highWaterMark`

### processDataWithLoop -- use pipeline()

```typescript
import { pipeline } from "stream";
import { promisify } from "util";
const pipelineAsync = promisify(pipeline);

const counter = new Transform({
  transform(chunk, _encoding, callback) {
    linesProcessed++;
    callback(null, transformFn(chunk.toString()));
  },
});

await pipelineAsync(source, counter, destination);
```

`stream.pipeline()` is the recommended way to connect streams. It:
- Handles backpressure between all connected streams automatically
- Propagates errors from any stream in the chain
- Destroys all streams if any one errors (preventing resource leaks)
- Properly calls `end()` on the destination

## Why This Matters

Without backpressure, Node.js streams provide no memory advantage over loading the entire file into memory. The entire point of streams is constant-memory processing -- reading a chunk, processing it, writing it, then reading the next chunk. Backpressure is the mechanism that coordinates this flow.

## Common Variations

- **HTTP responses**: Piping a large file to `res` (an HTTP response) without backpressure floods the client's TCP buffer
- **Database cursors**: Reading rows from a database cursor into a writable stream -- the cursor must be paused when the destination is full
- **Compression**: `zlib.createGzip()` can produce output faster than the destination can accept, requiring backpressure

## Documentation

- [Node.js: Backpressuring in Streams](https://nodejs.org/en/learn/modules/backpressuring-in-streams)
- [stream.pipeline()](https://nodejs.org/api/stream.html#streampipelinesource-transforms-destination-callback)
- [Writable.write() return value](https://nodejs.org/api/stream.html#writablewritechunk-encoding-callback)

## Interview Context

Stream backpressure is a frequent topic in Node.js backend interviews, especially for senior roles. A common question is: "How would you process a 10 GB file in Node.js without running out of memory?" The answer involves streams with proper backpressure. Interviewers look for understanding of `write()` returning `false`, the `drain` event, and `stream.pipeline()`. This concept also appears in system design interviews when discussing producer-consumer patterns and flow control in distributed systems.
