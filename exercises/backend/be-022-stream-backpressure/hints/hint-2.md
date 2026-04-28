# Hint 2 -- Medium

The pattern for manual backpressure is:

1. Call `destination.write(data)` and save the return value
2. If it returns `false`, call `source.pause()` to stop reading
3. Listen for `destination.once('drain', () => source.resume())` to restart when the buffer drains

For the `processDataWithLoop` function, Node.js provides `stream.pipeline()` (or `require('util').promisify(pipeline)`) which wires up backpressure, error propagation, and stream cleanup automatically. You can insert a `Transform` stream in the middle of the pipeline to count lines and apply the transform function.
