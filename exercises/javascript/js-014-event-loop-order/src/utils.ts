/**
 * Processes a queue of items through a pipeline.
 * Each item must go through three stages IN ORDER:
 *   1. validate(item) - synchronous validation
 *   2. transform(item) - async transformation
 *   3. save(item) - async persistence
 *
 * The trace array records the order of operations for debugging.
 * Expected trace for items ["a", "b"]:
 *   ["validate:a", "transform:a", "save:a", "validate:b", "transform:b", "save:b"]
 *
 * BUG: The current implementation uses setTimeout and queueMicrotask
 * in a way that causes operations to execute out of order.
 */
export async function processQueue(items: string[]): Promise<{
  trace: string[];
  results: string[];
}> {
  const trace: string[] = [];
  const results: string[] = [];

  // BUG: This processes all items "in parallel" using mixed task scheduling
  // instead of awaiting each item's pipeline sequentially.
  const promises = items.map((item) => {
    return new Promise<string>((resolve) => {
      // Validation in a macrotask -- wrong! This delays it.
      setTimeout(() => {
        trace.push(`validate:${item}`);

        // Transform in a microtask
        queueMicrotask(() => {
          trace.push(`transform:${item}`);
          const transformed = item.toUpperCase();

          // Save in another macrotask
          setTimeout(() => {
            trace.push(`save:${item}`);
            results.push(transformed);
            resolve(transformed);
          }, 0);
        });
      }, 0);
    });
  });

  await Promise.all(promises);
  return { trace, results };
}

/**
 * Initializes an application by setting up resources in the correct order.
 * Dependencies:
 *   1. loadConfig() must run first (everything depends on config)
 *   2. connectDb() depends on config
 *   3. startCache() depends on config
 *   4. startServer() depends on db AND cache being ready
 *
 * Returns a trace of initialization order.
 *
 * BUG: The current implementation schedules steps in different task queues,
 * causing them to execute in the wrong order.
 */
export async function initializeApp(): Promise<string[]> {
  const trace: string[] = [];

  // BUG: These are scheduled in different task queues and don't
  // properly await each other's completion.

  // Config is loaded in a macrotask (setTimeout)
  const configPromise = new Promise<void>((resolve) => {
    setTimeout(() => {
      trace.push("config:loaded");
      resolve();
    }, 0);
  });

  // DB connection starts immediately via microtask -- before config is loaded!
  const dbPromise = new Promise<void>((resolve) => {
    queueMicrotask(() => {
      trace.push("db:connected");
      resolve();
    });
  });

  // Cache starts synchronously
  trace.push("cache:started");

  // Server starts in a microtask
  const serverPromise = new Promise<void>((resolve) => {
    queueMicrotask(() => {
      trace.push("server:started");
      resolve();
    });
  });

  await Promise.all([configPromise, dbPromise, serverPromise]);
  return trace;
}

/**
 * Demonstrates correct understanding of event loop ordering.
 * Executes operations and returns the trace showing the actual
 * execution order.
 *
 * The function should produce this exact trace order:
 *   ["sync:1", "sync:2", "microtask:1", "microtask:2", "macrotask:1", "macrotask:2"]
 *
 * BUG: The trace entries are added in the wrong order because the code
 * mixes sync, microtask, and macrotask scheduling incorrectly.
 */
export async function demonstrateEventLoop(): Promise<string[]> {
  const trace: string[] = [];

  return new Promise((resolve) => {
    // BUG: These are scheduled in an order that doesn't match
    // the expected output
    setTimeout(() => {
      trace.push("macrotask:1");
    }, 0);

    trace.push("sync:1");

    queueMicrotask(() => {
      trace.push("microtask:1");
    });

    setTimeout(() => {
      trace.push("macrotask:2");
      // Resolve after all operations complete
      resolve(trace);
    }, 0);

    Promise.resolve().then(() => {
      trace.push("microtask:2");
    });

    // BUG: sync:2 should be second (it's synchronous) but this
    // is placed after async scheduling calls
    trace.push("sync:2");
  });
}
