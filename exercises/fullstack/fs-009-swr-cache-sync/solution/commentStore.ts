// Simplified SWR-like cache implementation

type Comment = {
  id: string;
  postId: string;
  author: string;
  text: string;
  createdAt: Date;
};

// In-memory "database"
const db: Comment[] = [
  {
    id: "c1",
    postId: "post-1",
    author: "Alice",
    text: "Great article!",
    createdAt: new Date("2024-03-01"),
  },
  {
    id: "c2",
    postId: "post-1",
    author: "Bob",
    text: "Thanks for sharing.",
    createdAt: new Date("2024-03-02"),
  },
];

let nextId = 3;

// SWR-like cache
const cache = new Map<string, { data: Comment[]; timestamp: number }>();
const STALE_TIME = 30_000; // 30 seconds

// Fetcher: simulates an API GET
async function fetchComments(postId: string): Promise<Comment[]> {
  await new Promise((resolve) => setTimeout(resolve, 5));
  return db.filter((c) => c.postId === postId);
}

// Read with cache (SWR pattern)
export async function getComments(postId: string): Promise<Comment[]> {
  const cacheKey = `comments:${postId}`;
  const cached = cache.get(cacheKey);
  const now = Date.now();

  if (cached && now - cached.timestamp < STALE_TIME) {
    return cached.data;
  }

  const data = await fetchComments(postId);
  cache.set(cacheKey, { data, timestamp: now });
  return data;
}

// Mutate: update or invalidate cache for a key
export function mutate(postId: string, data?: Comment[]): void {
  const cacheKey = `comments:${postId}`;
  if (data) {
    cache.set(cacheKey, { data, timestamp: Date.now() });
  } else {
    cache.delete(cacheKey);
  }
}

// FIX: After successful POST, invalidate the cache so getComments returns fresh data
export async function addComment(
  postId: string,
  author: string,
  text: string
): Promise<Comment> {
  await new Promise((resolve) => setTimeout(resolve, 5));

  const comment: Comment = {
    id: `c${nextId++}`,
    postId,
    author,
    text,
    createdAt: new Date(),
  };

  db.push(comment);

  // FIX: Invalidate the cache for this post so the next read fetches fresh data
  mutate(postId);

  return comment;
}

// Test helper
export function resetStore() {
  cache.clear();
  db.length = 0;
  db.push(
    {
      id: "c1",
      postId: "post-1",
      author: "Alice",
      text: "Great article!",
      createdAt: new Date("2024-03-01"),
    },
    {
      id: "c2",
      postId: "post-1",
      author: "Bob",
      text: "Thanks for sharing.",
      createdAt: new Date("2024-03-02"),
    }
  );
  nextId = 3;
}
