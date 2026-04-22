export type FetchFn<T> = () => Promise<T>;

const cache = new Map<string, { value: unknown; expiresAt: number }>();

// BUG: No in-flight tracking — concurrent misses all trigger fetches
export async function cachedFetch<T>(
  key: string,
  fetchFn: FetchFn<T>,
  ttlMs: number = 5000
): Promise<T> {
  const now = Date.now();
  const cached = cache.get(key);

  if (cached && cached.expiresAt > now) {
    return cached.value as T;
  }

  // BUG: Every caller that arrives during a cache miss will execute fetchFn
  // independently — no coalescing of concurrent requests
  const value = await fetchFn();
  cache.set(key, { value, expiresAt: now + ttlMs });

  return value;
}

export function clearCache(): void {
  cache.clear();
}

export function getCacheSize(): number {
  return cache.size;
}
