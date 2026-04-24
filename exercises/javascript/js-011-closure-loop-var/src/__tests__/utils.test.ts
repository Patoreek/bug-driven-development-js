import { describe, it, expect } from "vitest";
import { createTimers, createHandlers, createMultipliers } from "../utils";

describe("createTimers", () => {
  it("should create callbacks that return their own index", () => {
    const timers = createTimers(5);

    expect(timers[0]()).toBe(0);
    expect(timers[1]()).toBe(1);
    expect(timers[2]()).toBe(2);
    expect(timers[3]()).toBe(3);
    expect(timers[4]()).toBe(4);
  });

  it("should create the correct number of callbacks", () => {
    const timers = createTimers(3);
    expect(timers).toHaveLength(3);
  });

  it("should handle n = 1", () => {
    const timers = createTimers(1);
    expect(timers[0]()).toBe(0);
  });

  it("should handle n = 0", () => {
    const timers = createTimers(0);
    expect(timers).toHaveLength(0);
  });

  it("each callback should return a different value", () => {
    const timers = createTimers(4);
    const results = timers.map((fn) => fn());
    expect(results).toEqual([0, 1, 2, 3]);
  });
});

describe("createHandlers", () => {
  it("should create handlers with correct index and label", () => {
    const handlers = createHandlers(["Save", "Cancel", "Delete"]);

    expect(handlers[0]()).toBe("Button 0: Save");
    expect(handlers[1]()).toBe("Button 1: Cancel");
    expect(handlers[2]()).toBe("Button 2: Delete");
  });

  it("should handle single button", () => {
    const handlers = createHandlers(["Submit"]);
    expect(handlers[0]()).toBe("Button 0: Submit");
  });

  it("should handle empty array", () => {
    const handlers = createHandlers([]);
    expect(handlers).toHaveLength(0);
  });

  it("each handler should reference its own button", () => {
    const handlers = createHandlers(["A", "B", "C"]);
    const results = handlers.map((fn) => fn());
    expect(results).toEqual(["Button 0: A", "Button 1: B", "Button 2: C"]);
  });
});

describe("createMultipliers", () => {
  it("should create functions that multiply by 1, 2, 3, ..., n", () => {
    const muls = createMultipliers(3);

    expect(muls[0](5)).toBe(5); // 5 * 1
    expect(muls[1](5)).toBe(10); // 5 * 2
    expect(muls[2](5)).toBe(15); // 5 * 3
  });

  it("should work with different input values", () => {
    const muls = createMultipliers(4);

    expect(muls[0](10)).toBe(10); // 10 * 1
    expect(muls[1](10)).toBe(20); // 10 * 2
    expect(muls[2](10)).toBe(30); // 10 * 3
    expect(muls[3](10)).toBe(40); // 10 * 4
  });

  it("should handle n = 1", () => {
    const muls = createMultipliers(1);
    expect(muls[0](7)).toBe(7); // 7 * 1
  });

  it("each multiplier should use a different factor", () => {
    const muls = createMultipliers(5);
    const results = muls.map((fn) => fn(1));
    expect(results).toEqual([1, 2, 3, 4, 5]);
  });
});
