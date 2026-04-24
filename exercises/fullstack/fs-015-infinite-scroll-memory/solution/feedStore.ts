export interface FeedItem {
  id: string;
  content: string;
  timestamp: number;
}

export interface PageData {
  page: number;
  items: FeedItem[];
}

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

// FIX: Implement sliding window that keeps only maxPages in memory
export function createFeedStore(maxPages: number = 5): FeedStore {
  const pages: Map<number, PageData> = new Map();

  // FIX: Enforce the window by removing pages outside the range
  function enforceWindow(): void {
    if (pages.size <= maxPages) return;

    const sortedPageNums = [...pages.keys()].sort((a, b) => a - b);

    // Remove oldest pages until we're within the window
    while (sortedPageNums.length > maxPages) {
      const oldest = sortedPageNums.shift()!;
      pages.delete(oldest);
    }
  }

  function loadPage(page: number): void {
    if (pages.has(page)) return;

    const data = fetchPage(page);
    pages.set(page, data);

    // FIX: Trim pages outside the window
    enforceWindow();
  }

  function getItems(): FeedItem[] {
    const allItems: FeedItem[] = [];
    const sortedPages = [...pages.keys()].sort((a, b) => a - b);
    for (const pageNum of sortedPages) {
      allItems.push(...pages.get(pageNum)!.items);
    }
    return allItems;
  }

  // FIX: Returns only items from pages within the current window
  function getWindowedItems(): FeedItem[] {
    return getItems(); // Now getItems only has windowed pages
  }

  function getLoadedPageCount(): number {
    return pages.size;
  }

  // FIX: Returns the actual windowed range
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

  // FIX: Recenter the window around the target page
  function scrollToPage(targetPage: number): void {
    // Calculate the window centered on the target
    const halfWindow = Math.floor(maxPages / 2);
    const windowStart = Math.max(0, targetPage - halfWindow);
    const windowEnd = windowStart + maxPages - 1;

    // Load pages in the new window
    for (let p = windowStart; p <= windowEnd; p++) {
      if (!pages.has(p)) {
        const data = fetchPage(p);
        pages.set(p, data);
      }
    }

    // Remove pages outside the new window
    for (const pageNum of [...pages.keys()]) {
      if (pageNum < windowStart || pageNum > windowEnd) {
        pages.delete(pageNum);
      }
    }
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
