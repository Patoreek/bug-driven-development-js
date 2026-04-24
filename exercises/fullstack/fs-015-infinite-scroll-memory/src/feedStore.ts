// BUG: Feed store that accumulates all pages without any windowing or cleanup

export interface FeedItem {
  id: string;
  content: string;
  timestamp: number;
}

export interface PageData {
  page: number;
  items: FeedItem[];
}

// Simulated API that generates feed data
export function fetchPage(page: number, pageSize: number = 20): PageData {
  const items: FeedItem[] = [];
  for (let i = 0; i < pageSize; i++) {
    const idx = page * pageSize + i;
    items.push({
      id: `item-${idx}`,
      content: `Post #${idx}`,
      timestamp: Date.now() - idx * 60000,
    });
  }
  return { page, items };
}

export interface FeedStore {
  loadPage: (page: number) => void;
  getItems: () => FeedItem[];
  getWindowedItems: () => FeedItem[];
  getLoadedPageCount: () => number;
  getWindowRange: () => { startPage: number; endPage: number };
  getTotalItemsInMemory: () => number;
  scrollToPage: (page: number) => void;
  reset: () => void;
}

// BUG: maxPages is accepted but never used — all pages stay in memory forever
export function createFeedStore(maxPages: number = 5): FeedStore {
  const pages: Map<number, PageData> = new Map();

  function loadPage(page: number): void {
    if (pages.has(page)) return;

    const data = fetchPage(page);
    pages.set(page, data);

    // BUG: Never removes old pages. After loading 100 pages,
    // all 100 are still in memory.
    // Should remove pages outside the window of maxPages
  }

  function getItems(): FeedItem[] {
    // BUG: Returns ALL items from ALL pages — grows without bound
    const allItems: FeedItem[] = [];
    const sortedPages = [...pages.keys()].sort((a, b) => a - b);
    for (const pageNum of sortedPages) {
      allItems.push(...pages.get(pageNum)!.items);
    }
    return allItems;
  }

  // BUG: This should return only items in the current window,
  // but it just calls getItems() — returns everything
  function getWindowedItems(): FeedItem[] {
    return getItems();
  }

  function getLoadedPageCount(): number {
    return pages.size;
  }

  // BUG: Always returns the full range of all loaded pages
  // Should return only the windowed range
  function getWindowRange(): { startPage: number; endPage: number } {
    const pageNums = [...pages.keys()].sort((a, b) => a - b);
    if (pageNums.length === 0) return { startPage: 0, endPage: 0 };
    return { startPage: pageNums[0], endPage: pageNums[pageNums.length - 1] };
  }

  function getTotalItemsInMemory(): number {
    let count = 0;
    for (const pageData of pages.values()) {
      count += pageData.items.length;
    }
    return count;
  }

  // BUG: scrollToPage does nothing — should recenter the window
  function scrollToPage(_page: number): void {
    // Does nothing
  }

  function reset(): void {
    pages.clear();
  }

  return {
    loadPage,
    getItems,
    getWindowedItems,
    getLoadedPageCount,
    getWindowRange,
    getTotalItemsInMemory,
    scrollToPage,
    reset,
  };
}
