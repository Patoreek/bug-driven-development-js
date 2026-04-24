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
 * FIX: Use async/await to process items sequentially with proper ordering.
 */
export async function processQueue(items: string[]): Promise<{
  trace: string[];
  results: string[];
}> {
  const trace: string[] = [];
  const results: string[] = [];

  // FIX: Process items sequentially using a simple for...of loop with await.
  // No setTimeout or queueMicrotask needed -- just straightforward async/await.
  for (const item of items) {
    // Step 1: validate (synchronous)
    trace.push(`validate:${item}`);

    // Step 2: transform (async)
    const transformed = await Promise.resolve(item.toUpperCase());
    trace.push(`transform:${item}`);

    // Step 3: save (async)
    await Promise.resolve();
    trace.push(`save:${item}`);
    results.push(transformed);
  }

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
 * FIX: Use async/await to enforce the correct dependency order.
 */
export async function initializeApp(): Promise<string[]> {
  const trace: string[] = [];

  // FIX: Use await to enforce sequential ordering where dependencies exist.

  // Step 1: Load config first (everything depends on it)
  await Promise.resolve();
  trace.push("config:loaded");

  // Step 2: Connect DB (depends on config)
  await Promise.resolve();
  trace.push("db:connected");

  // Step 3: Start cache (depends on config)
  await Promise.resolve();
  trace.push("cache:started");

  // Step 4: Start server (depends on db AND cache)
  await Promise.resolve();
  trace.push("server:started");

  return trace;
}

/**
 * Demonstrates correct understanding of event loop ordering.
 * Executes operations and returns the trace showing the actual
 * execution order.
 *
 * The function produces this exact trace order:
 *   ["sync:1", "sync:2", "microtask:1", "microtask:2", "macrotask:1", "macrotask:2"]
 *
 * FIX: Schedule operations in the correct task queues so the output
 * matches event loop execution order.
 */
export async function demonstrateEventLoop(): Promise<string[]> {
  const trace: string[] = [];

  return new Promise((resolve) => {
    // Macrotasks: scheduled via setTimeout, run after all microtasks
    setTimeout(() => {
      trace.push("macrotask:1");
    }, 0);

    setTimeout(() => {
      trace.push("macrotask:2");
      // Resolve after all operations complete
      resolve(trace);
    }, 0);

    // Synchronous: runs first, in order
    trace.push("sync:1");
    trace.push("sync:2");

    // Microtasks: run after synchronous code, before macrotasks
    queueMicrotask(() => {
      trace.push("microtask:1");
    });

    Promise.resolve().then(() => {
      trace.push("microtask:2");
    });
  });
}
