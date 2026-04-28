import { describe, it, expect } from "vitest";
import { Range, LinkedList, InfiniteSequence } from "../utils";

describe("Range", () => {
  it("should be iterable with for...of", () => {
    const range = new Range(1, 5);
    const values: number[] = [];

    for (const n of range) {
      values.push(n);
    }

    expect(values).toEqual([1, 2, 3, 4, 5]);
  });

  it("should support custom step", () => {
    const range = new Range(0, 10, 3);
    const values: number[] = [];

    for (const n of range) {
      values.push(n);
    }

    expect(values).toEqual([0, 3, 6, 9]);
  });

  it("should work with spread operator", () => {
    const range = new Range(1, 3);
    expect([...range]).toEqual([1, 2, 3]);
  });

  it("should work with Array.from", () => {
    const range = new Range(2, 6, 2);
    expect(Array.from(range)).toEqual([2, 4, 6]);
  });

  it("should work with destructuring", () => {
    const range = new Range(10, 13);
    const [a, b, c, d] = range;

    expect(a).toBe(10);
    expect(b).toBe(11);
    expect(c).toBe(12);
    expect(d).toBe(13);
  });

  it("should produce an empty sequence when start > end", () => {
    const range = new Range(5, 3);
    expect([...range]).toEqual([]);
  });

  it("should be re-iterable (each for...of starts fresh)", () => {
    const range = new Range(1, 3);

    const first = [...range];
    const second = [...range];

    expect(first).toEqual([1, 2, 3]);
    expect(second).toEqual([1, 2, 3]);
  });

  it("should throw for non-positive step", () => {
    expect(() => new Range(1, 10, 0)).toThrow(/positive/i);
    expect(() => new Range(1, 10, -1)).toThrow(/positive/i);
  });
});

describe("LinkedList", () => {
  it("should be iterable with for...of", () => {
    const list = new LinkedList<number>();
    list.append(10);
    list.append(20);
    list.append(30);

    const values: number[] = [];
    for (const v of list) {
      values.push(v);
    }

    expect(values).toEqual([10, 20, 30]);
  });

  it("should work with spread operator", () => {
    const list = new LinkedList<string>();
    list.append("a");
    list.append("b");
    list.append("c");

    expect([...list]).toEqual(["a", "b", "c"]);
  });

  it("should produce an empty array for an empty list", () => {
    const list = new LinkedList<number>();
    expect([...list]).toEqual([]);
  });

  it("should be re-iterable", () => {
    const list = new LinkedList<number>();
    list.append(1);
    list.append(2);

    expect([...list]).toEqual([1, 2]);
    expect([...list]).toEqual([1, 2]);
  });

  it("should work with Array.from", () => {
    const list = new LinkedList<number>();
    list.append(5);
    list.append(10);

    expect(Array.from(list)).toEqual([5, 10]);
  });

  it("should work with destructuring", () => {
    const list = new LinkedList<string>();
    list.append("x");
    list.append("y");
    list.append("z");

    const [first, second, third] = list;
    expect(first).toBe("x");
    expect(second).toBe("y");
    expect(third).toBe("z");
  });
});

describe("InfiniteSequence", () => {
  it("should produce values by applying the function repeatedly", () => {
    const doubles = new InfiniteSequence(1, (n) => n * 2);
    const values: number[] = [];

    let count = 0;
    for (const n of doubles) {
      values.push(n);
      count++;
      if (count >= 5) break;
    }

    expect(values).toEqual([1, 2, 4, 8, 16]);
  });

  it("should be re-iterable (each iteration starts from seed)", () => {
    const seq = new InfiniteSequence(0, (n) => n + 1);

    const first: number[] = [];
    let count = 0;
    for (const n of seq) {
      first.push(n);
      count++;
      if (count >= 3) break;
    }

    const second: number[] = [];
    count = 0;
    for (const n of seq) {
      second.push(n);
      count++;
      if (count >= 3) break;
    }

    expect(first).toEqual([0, 1, 2]);
    expect(second).toEqual([0, 1, 2]); // Must restart, not [3, 4, 5]
  });

  it("should work with destructuring (takes first N values)", () => {
    const fib = new InfiniteSequence(
      [0, 1] as [number, number],
      ([a, b]) => [b, a + b] as [number, number]
    );

    const values: number[] = [];
    let count = 0;
    for (const [, b] of fib) {
      values.push(b);
      count++;
      if (count >= 6) break;
    }

    expect(values).toEqual([1, 1, 2, 3, 5, 8]);
  });
});
