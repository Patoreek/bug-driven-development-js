// BUG: Infinite scroll hook that doesn't implement windowing

import { createFeedStore, type FeedStore, type FeedItem } from "./feedStore";

export interface UseInfiniteScrollResult {
  items: FeedItem[];
  loadMore: () => void;
  currentPage: number;
  isLoading: boolean;
  totalInMemory: number;
}

// BUG: This hook creates a store but never leverages windowing.
// It just keeps loading more and more pages.
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

  // BUG: Returns ALL items, not windowed items
  function getState(): UseInfiniteScrollResult {
    return {
      items: store.getItems(),
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
