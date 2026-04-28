import { describe, it, expect } from "vitest";
import {
  type GetReturnType,
  type UnpackPromise,
  type FirstElement,
  type ConstructorParams,
  type FlattenArray,
  type Event,
  type ExtractEventData,
  type Expect,
  type Equal,
  getReturnValue,
  firstElement,
} from "../inferKeyword";

describe("GetReturnType - infer return type of function", () => {
  it("extracts return type from a simple function", () => {
    type Result = GetReturnType<(x: string) => number>;
    const check: Expect<Equal<Result, number>> = true;
    expect(check).toBe(true);
  });

  it("extracts return type from a no-arg function", () => {
    type Result = GetReturnType<() => string>;
    const check: Expect<Equal<Result, string>> = true;
    expect(check).toBe(true);
  });

  it("extracts void return type", () => {
    type Result = GetReturnType<(a: number, b: number) => void>;
    const check: Expect<Equal<Result, void>> = true;
    expect(check).toBe(true);
  });

  it("returns never for non-function types", () => {
    type Result = GetReturnType<string>;
    const check: Expect<Equal<Result, never>> = true;
    expect(check).toBe(true);
  });

  it("runtime: gets return value from function", () => {
    const result = getReturnValue(() => 42);
    expect(result).toBe(42);
  });
});

describe("UnpackPromise - deeply unwrap Promise types", () => {
  it("unwraps a single Promise", () => {
    type Result = UnpackPromise<Promise<string>>;
    const check: Expect<Equal<Result, string>> = true;
    expect(check).toBe(true);
  });

  it("deeply unwraps nested Promises", () => {
    type Result = UnpackPromise<Promise<Promise<number>>>;
    const check: Expect<Equal<Result, number>> = true;
    expect(check).toBe(true);
  });

  it("deeply unwraps triple-nested Promises", () => {
    type Result = UnpackPromise<Promise<Promise<Promise<boolean>>>>;
    const check: Expect<Equal<Result, boolean>> = true;
    expect(check).toBe(true);
  });

  it("returns non-Promise types unchanged", () => {
    type Result = UnpackPromise<string>;
    const check: Expect<Equal<Result, string>> = true;
    expect(check).toBe(true);
  });
});

describe("FirstElement - extract first tuple element", () => {
  it("gets the first element of a tuple", () => {
    type Result = FirstElement<[string, number, boolean]>;
    const check: Expect<Equal<Result, string>> = true;
    expect(check).toBe(true);
  });

  it("gets the first element of a single-element tuple", () => {
    type Result = FirstElement<[number]>;
    const check: Expect<Equal<Result, number>> = true;
    expect(check).toBe(true);
  });

  it("returns never for empty tuple", () => {
    type Result = FirstElement<[]>;
    const check: Expect<Equal<Result, never>> = true;
    expect(check).toBe(true);
  });

  it("runtime: gets first element of array", () => {
    expect(firstElement([1, 2, 3])).toBe(1);
    expect(firstElement([])).toBeUndefined();
  });
});

describe("ConstructorParams - extract constructor parameter types", () => {
  it("extracts constructor params from a class", () => {
    class Point {
      constructor(public x: number, public y: number) {}
    }
    type Result = ConstructorParams<typeof Point>;
    const check: Expect<Equal<Result, [x: number, y: number]>> = true;
    expect(check).toBe(true);
  });

  it("extracts empty params from no-arg constructor", () => {
    class Empty {
      constructor() {}
    }
    type Result = ConstructorParams<typeof Empty>;
    const check: Expect<Equal<Result, []>> = true;
    expect(check).toBe(true);
  });
});

describe("FlattenArray - deeply flatten array types", () => {
  it("flattens a simple array", () => {
    type Result = FlattenArray<string[]>;
    const check: Expect<Equal<Result, string>> = true;
    expect(check).toBe(true);
  });

  it("deeply flattens nested arrays", () => {
    type Result = FlattenArray<number[][]>;
    const check: Expect<Equal<Result, number>> = true;
    expect(check).toBe(true);
  });

  it("deeply flattens triple-nested arrays", () => {
    type Result = FlattenArray<boolean[][][]>;
    const check: Expect<Equal<Result, boolean>> = true;
    expect(check).toBe(true);
  });

  it("returns non-array types unchanged", () => {
    type Result = FlattenArray<string>;
    const check: Expect<Equal<Result, string>> = true;
    expect(check).toBe(true);
  });
});

describe("ExtractEventData - extract data from custom event type", () => {
  it("extracts data type from an event", () => {
    type ClickEvent = Event<"click", { x: number; y: number }>;
    type Result = ExtractEventData<ClickEvent>;
    const check: Expect<Equal<Result, { x: number; y: number }>> = true;
    expect(check).toBe(true);
  });

  it("extracts string data from an event", () => {
    type MessageEvent = Event<"message", string>;
    type Result = ExtractEventData<MessageEvent>;
    const check: Expect<Equal<Result, string>> = true;
    expect(check).toBe(true);
  });

  it("returns never for non-event types", () => {
    type Result = ExtractEventData<{ type: string }>;
    const check: Expect<Equal<Result, never>> = true;
    expect(check).toBe(true);
  });
});
