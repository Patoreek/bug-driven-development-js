// Simulated in-memory database
const bookmarks: Array<{
  id: string;
  url: string;
  title: string;
  createdAt: Date;
}> = [];

let nextId = 1;

// Simulated cache
let cachedBookmarks: typeof bookmarks | null = null;

export type BookmarkResult = {
  success: boolean;
  error?: string;
  bookmark?: (typeof bookmarks)[number];
};

// BUG: getBookmarks caches the result but addBookmark never invalidates the cache
export function getBookmarks() {
  if (!cachedBookmarks) {
    cachedBookmarks = [...bookmarks];
  }
  return cachedBookmarks;
}

export async function addBookmark(url: string, title: string): Promise<BookmarkResult> {
  if (!url || !title) {
    return { success: false, error: "URL and title are required" };
  }

  const bookmark = {
    id: `bm-${nextId++}`,
    url,
    title,
    createdAt: new Date(),
  };

  bookmarks.push(bookmark);

  // BUG: Cache is not invalidated after mutation
  // cachedBookmarks still holds stale data

  return { success: true, bookmark };
}

export async function deleteBookmark(id: string): Promise<BookmarkResult> {
  const index = bookmarks.findIndex((b) => b.id === id);
  if (index === -1) {
    return { success: false, error: "Bookmark not found" };
  }

  bookmarks.splice(index, 1);

  // BUG: Cache is not invalidated after deletion either

  return { success: true };
}

export function clearBookmarks() {
  bookmarks.length = 0;
  cachedBookmarks = null;
  nextId = 1;
}
