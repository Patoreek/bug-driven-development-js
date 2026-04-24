import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { processQueue, initializeApp, demonstrateEventLoop } from "../utils";

describe("processQueue", () => {
  it("should process items in sequential order", async () => {
    const { trace } = await processQueue(["a", "b"]);

    expect(trace).toEqual([
      "validate:a",
      "transform:a",
      "save:a",
      "validate:b",
      "transform:b",
      "save:b",
    ]);
  });

  it("should produce correct results", async () => {
    const { results } = await processQueue(["hello", "world"]);

    expect(results).toEqual(["HELLO", "WORLD"]);
  });

  it("should handle single item", async () => {
    const { trace, results } = await processQueue(["x"]);

    expect(trace).toEqual(["validate:x", "transform:x", "save:x"]);
    expect(results).toEqual(["X"]);
  });

  it("should handle empty queue", async () => {
    const { trace, results } = await processQueue([]);

    expect(trace).toEqual([]);
    expect(results).toEqual([]);
  });

  it("should maintain correct order for many items", async () => {
    const items = ["a", "b", "c", "d"];
    const { trace } = await processQueue(items);

    // Every validate should come before its transform, every transform before its save
    for (const item of items) {
      const validateIdx = trace.indexOf(`validate:${item}`);
      const transformIdx = trace.indexOf(`transform:${item}`);
      const saveIdx = trace.indexOf(`save:${item}`);

      expect(validateIdx).toBeLessThan(transformIdx);
      expect(transformIdx).toBeLessThan(saveIdx);
    }

    // Items should be processed sequentially: all of a before any of b
    for (let i = 0; i < items.length - 1; i++) {
      const currentSave = trace.indexOf(`save:${items[i]}`);
      const nextValidate = trace.indexOf(`validate:${items[i + 1]}`);
      expect(currentSave).toBeLessThan(nextValidate);
    }
  });
});

describe("initializeApp", () => {
  it("should load config before everything else", async () => {
    const trace = await initializeApp();

    const configIdx = trace.indexOf("config:loaded");
    const dbIdx = trace.indexOf("db:connected");
    const cacheIdx = trace.indexOf("cache:started");
    const serverIdx = trace.indexOf("server:started");

    expect(configIdx).toBeLessThan(dbIdx);
    expect(configIdx).toBeLessThan(cacheIdx);
    expect(configIdx).toBeLessThan(serverIdx);
  });

  it("should start db and cache before server", async () => {
    const trace = await initializeApp();

    const dbIdx = trace.indexOf("db:connected");
    const cacheIdx = trace.indexOf("cache:started");
    const serverIdx = trace.indexOf("server:started");

    expect(dbIdx).toBeLessThan(serverIdx);
    expect(cacheIdx).toBeLessThan(serverIdx);
  });

  it("should include all four initialization steps", async () => {
    const trace = await initializeApp();

    expect(trace).toContain("config:loaded");
    expect(trace).toContain("db:connected");
    expect(trace).toContain("cache:started");
    expect(trace).toContain("server:started");
    expect(trace).toHaveLength(4);
  });

  it("should produce the exact correct order", async () => {
    const trace = await initializeApp();

    expect(trace).toEqual([
      "config:loaded",
      "db:connected",
      "cache:started",
      "server:started",
    ]);
  });
});

describe("demonstrateEventLoop", () => {
  it("should execute sync code before microtasks", async () => {
    const trace = await demonstrateEventLoop();

    const sync1 = trace.indexOf("sync:1");
    const sync2 = trace.indexOf("sync:2");
    const micro1 = trace.indexOf("microtask:1");

    expect(sync1).toBeLessThan(micro1);
    expect(sync2).toBeLessThan(micro1);
  });

  it("should execute microtasks before macrotasks", async () => {
    const trace = await demonstrateEventLoop();

    const micro2 = trace.indexOf("microtask:2");
    const macro1 = trace.indexOf("macrotask:1");

    expect(micro2).toBeLessThan(macro1);
  });

  it("should produce the exact correct event loop order", async () => {
    const trace = await demonstrateEventLoop();

    expect(trace).toEqual([
      "sync:1",
      "sync:2",
      "microtask:1",
      "microtask:2",
      "macrotask:1",
      "macrotask:2",
    ]);
  });
});
