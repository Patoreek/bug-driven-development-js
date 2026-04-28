# Hint 3 -- Strong

Here's the fix for `processData`:

```typescript
source.on("data", (chunk) => {
  const transformed = transformFn(chunk.toString());
  linesProcessed++;

  const canContinue = destination.write(transformed);

  if (!canContinue) {
    backpressureEvents++;
    source.pause();
    destination.once("drain", () => {
      source.resume();
    });
  }
});
```

And for `processDataWithLoop`, replace the manual `for await...of` loop with `pipeline`:

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

`pipeline()` handles backpressure between all connected streams automatically.
