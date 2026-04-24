import { createFeedStore, type FeedStore, type FeedItem } from "./feedStore";

export interface UseInfiniteScrollResult {
  items: FeedItem[];
  loadMore: () => void;
  currentPage: number;
  isLoading: boolean;
  totalInMemory: number;
}

// FIX: Uses windowed items instead of all items
export function createInfiniteScrollController(maxPages: number = 5) {
  const store: FeedStore = createFeedStore(maxPages);
  let currentPage = 0;
  let isLoading = false;

  function loadMore(): void {
    if (isLoading) return;
    isLoading = true;

    store.loadPage(currentPage);
    currentPage++;
    isLoading = false;
  }

  // FIX: Returns windowed items, not all items
  function getState(): UseInfiniteScrollResult {
    return {
      items: store.getWindowedItems(),
      loadMore,
      currentPage,
      isLoading,
      totalInMemory: store.getTotalItemsInMemory(),
    };
  }

  function getStore(): FeedStore {
    return store;
  }

  return { loadMore, getState, getStore };
}
