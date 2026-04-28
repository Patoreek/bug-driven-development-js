import { describe, it, expect, vi } from "vitest";
import { paginatedFetch, takeAsync, mapAsync, FetchPage } from "../utils";

function createMockApi<T>(pages: T[][]): FetchPage<T> {
  let callIndex = 0;

  return vi.fn(async (_cursor: string | null) => {
    const items = pages[callIndex] ?? [];
    callIndex++;
    const nextCursor = callIndex < pages.length ? `page-${callIndex}` : null;
    return { items, nextCursor };
  });
}

describe("paginatedFetch", () => {
  it("should yield individual items, not arrays", async () => {
    const fetchPage = createMockApi([[1, 2], [3, 4]]);
    const items: number[] = [];

    for await (const item of paginatedFetch(fetchPage)) {
      items.push(item);
      if (items.length >= 4) break;
    }

    // Each item should be a number, not an array
    expect(items).toEqual([1, 2, 3, 4]);
    expect(typeof items[0]).toBe("number");
  });

  it("should stop fetching when there are no more pages", async () => {
    const fetchPage = createMockApi([[1, 2], [3]]);
    const items: number[] = [];

    for await (const item of paginatedFetch(fetchPage)) {
      items.push(item);
    }

    expect(items).toEqual([1, 2, 3]);
    // Should have called fetchPage exactly twice (2 pages)
    expect(fetchPage).toHaveBeenCalledTimes(2);
  });

  it("should handle a single page", async () => {
    const fetchPage = createMockApi([["a", "b", "c"]]);
    const items: string[] = [];

    for await (const item of paginatedFetch(fetchPage)) {
      items.push(item);
    }

    expect(items).toEqual(["a", "b", "c"]);
    expect(fetchPage).toHaveBeenCalledTimes(1);
  });

  it("should handle an empty first page", async () => {
    const fetchPage = createMockApi([[]]);
    const items: unknown[] = [];

    for await (const item of paginatedFetch(fetchPage)) {
      items.push(item);
    }

    expect(items).toEqual([]);
    expect(fetchPage).toHaveBeenCalledTimes(1);
  });

  it("should lazily fetch pages (not all at once)", async () => {
    const fetchPage = createMockApi([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
    const items: number[] = [];

    for await (const item of paginatedFetch(fetchPage)) {
      items.push(item);
      // Break after getting items from the first page only
      if (items.length >= 3) break;
    }

    expect(items).toEqual([1, 2, 3]);
    // Should only have fetched the first page
    expect(fetchPage).toHaveBeenCalledTimes(1);
  });
});

describe("takeAsync", () => {
  it("should take exactly n items", async () => {
    const fetchPage = createMockApi([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
    const gen = paginatedFetch(fetchPage);

    const items = await takeAsync(gen, 5);
    expect(items).toEqual([1, 2, 3, 4, 5]);
    expect(items).toHaveLength(5);
  });

  it("should take fewer items if iterable is exhausted", async () => {
    const fetchPage = createMockApi([[1, 2]]);
    const gen = paginatedFetch(fetchPage);

    const items = await takeAsync(gen, 10);
    expect(items).toEqual([1, 2]);
  });

  it("should take 0 items", async () => {
    const fetchPage = createMockApi([[1, 2, 3]]);
    const gen = paginatedFetch(fetchPage);

    const items = await takeAsync(gen, 0);
    expect(items).toEqual([]);
  });

  it("should clean up the iterator when done early", async () => {
    const fetchPage = createMockApi([[1, 2, 3], [4, 5, 6]]);
    const gen = paginatedFetch(fetchPage);
    const returnSpy = vi.spyOn(gen, "return");

    await takeAsync(gen, 2);

    // Should call return() to clean up the generator
    expect(returnSpy).toHaveBeenCalled();
  });
});

describe("mapAsync", () => {
  it("should transform items with a sync mapping function", async () => {
    const fetchPage = createMockApi([[1, 2, 3]]);
    const gen = paginatedFetch(fetchPage);

    const doubled = mapAsync(gen, (n: number) => n * 2);
    const items: number[] = [];

    for await (const item of doubled) {
      items.push(item);
    }

    expect(items).toEqual([2, 4, 6]);
  });

  it("should transform items with an async mapping function", async () => {
    const fetchPage = createMockApi([["hello", "world"]]);
    const gen = paginatedFetch(fetchPage);

    const uppercased = mapAsync(gen, async (s: string) => {
      // Simulate async work
      return s.toUpperCase();
    });

    const items: string[] = [];
    for await (const item of uppercased) {
      items.push(item);
    }

    // Items should be resolved strings, not Promise objects
    expect(items).toEqual(["HELLO", "WORLD"]);
    expect(typeof items[0]).toBe("string");
  });

  it("should handle empty iterables", async () => {
    const fetchPage = createMockApi([[]]);
    const gen = paginatedFetch(fetchPage);

    const mapped = mapAsync(gen, (n: number) => n * 2);
    const items: number[] = [];

    for await (const item of mapped) {
      items.push(item);
    }

    expect(items).toEqual([]);
  });
});
