import { describe, it, expect, beforeEach } from "vitest";
import { createFeedStore, type FeedStore } from "../feedStore";
import { createInfiniteScrollController } from "../useInfiniteScroll";

describe("feedStore - sliding window", () => {
  let store: FeedStore;

  beforeEach(() => {
    store = createFeedStore(3); // Keep at most 3 pages in memory
  });

  it("loads a single page correctly", () => {
    store.loadPage(0);

    expect(store.getLoadedPageCount()).toBe(1);
    expect(store.getWindowedItems()).toHaveLength(20);
    expect(store.getWindowedItems()[0].id).toBe("item-0");
  });

  it("keeps pages within the maxPages window", () => {
    // Load 5 pages with a window of 3
    store.loadPage(0);
    store.loadPage(1);
    store.loadPage(2);
    store.loadPage(3);
    store.loadPage(4);

    // Only the most recent 3 pages should be in memory
    expect(store.getLoadedPageCount()).toBeLessThanOrEqual(3);
  });

  it("drops oldest pages when window is exceeded", () => {
    store.loadPage(0);
    store.loadPage(1);
    store.loadPage(2);
    store.loadPage(3); // Should drop page 0
    store.loadPage(4); // Should drop page 1

    const range = store.getWindowRange();
    expect(range.startPage).toBeGreaterThanOrEqual(2);
    expect(range.endPage).toBe(4);
  });

  it("getWindowedItems returns only items from windowed pages", () => {
    store.loadPage(0);
    store.loadPage(1);
    store.loadPage(2);
    store.loadPage(3);
    store.loadPage(4);

    const windowedItems = store.getWindowedItems();
    // At most 3 pages * 20 items = 60 items
    expect(windowedItems.length).toBeLessThanOrEqual(60);
  });

  it("memory stays bounded regardless of total pages loaded", () => {
    // Load 20 pages into a store with maxPages=3
    for (let i = 0; i < 20; i++) {
      store.loadPage(i);
    }

    // Should only have 3 pages worth of items in memory
    expect(store.getTotalItemsInMemory()).toBeLessThanOrEqual(60);
    expect(store.getLoadedPageCount()).toBeLessThanOrEqual(3);
  });

  it("getTotalItemsInMemory is bounded by maxPages * pageSize", () => {
    for (let i = 0; i < 10; i++) {
      store.loadPage(i);
    }

    // 3 pages * 20 items = 60 max
    expect(store.getTotalItemsInMemory()).toBeLessThanOrEqual(60);
  });
});

describe("feedStore - scrollToPage", () => {
  let store: FeedStore;

  beforeEach(() => {
    store = createFeedStore(3);
    // Pre-load pages 0 through 9
    for (let i = 0; i < 10; i++) {
      store.loadPage(i);
    }
  });

  it("recenters window around the target page", () => {
    store.scrollToPage(5);

    const range = store.getWindowRange();
    // Window should include page 5
    expect(range.startPage).toBeLessThanOrEqual(5);
    expect(range.endPage).toBeGreaterThanOrEqual(5);
  });

  it("windowed items reflect the new window after scroll", () => {
    store.scrollToPage(5);

    const items = store.getWindowedItems();
    // Should have items from around page 5, not from page 0
    const ids = items.map((item) => item.id);
    // Page 5 starts at item 100 (5 * 20)
    expect(ids.some((id) => id.includes("100") || id.includes("10"))).toBe(true);
  });
});

describe("feedStore - window range tracking", () => {
  let store: FeedStore;

  beforeEach(() => {
    store = createFeedStore(3);
  });

  it("tracks correct window range after sequential loads", () => {
    store.loadPage(0);
    expect(store.getWindowRange()).toEqual({ startPage: 0, endPage: 0 });

    store.loadPage(1);
    expect(store.getWindowRange()).toEqual({ startPage: 0, endPage: 1 });

    store.loadPage(2);
    expect(store.getWindowRange()).toEqual({ startPage: 0, endPage: 2 });

    store.loadPage(3);
    // Page 0 should be dropped
    const range = store.getWindowRange();
    expect(range.endPage).toBe(3);
    expect(range.startPage).toBeGreaterThanOrEqual(1);
  });

  it("empty store returns zero range", () => {
    expect(store.getWindowRange()).toEqual({ startPage: 0, endPage: 0 });
  });
});

describe("infiniteScrollController - integration", () => {
  it("uses windowed items instead of all items", () => {
    const controller = createInfiniteScrollController(3);

    // Load 10 pages
    for (let i = 0; i < 10; i++) {
      controller.loadMore();
    }

    const state = controller.getState();

    // Items should be bounded by the window, not all 200
    expect(state.items.length).toBeLessThanOrEqual(60); // 3 pages * 20
    expect(state.totalInMemory).toBeLessThanOrEqual(60);
  });

  it("reports correct totalInMemory count", () => {
    const controller = createInfiniteScrollController(3);

    controller.loadMore(); // page 0
    controller.loadMore(); // page 1

    let state = controller.getState();
    expect(state.totalInMemory).toBe(40); // 2 pages * 20

    controller.loadMore(); // page 2
    controller.loadMore(); // page 3 — should drop page 0

    state = controller.getState();
    expect(state.totalInMemory).toBeLessThanOrEqual(60);
  });
});

describe("feedStore - reset", () => {
  it("clears all data on reset", () => {
    const store = createFeedStore(3);
    store.loadPage(0);
    store.loadPage(1);

    store.reset();

    expect(store.getLoadedPageCount()).toBe(0);
    expect(store.getTotalItemsInMemory()).toBe(0);
    expect(store.getWindowedItems()).toHaveLength(0);
  });
});
