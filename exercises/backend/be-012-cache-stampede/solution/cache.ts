export type FetchFn<T> = () => Promise<T>;

const cache = new Map<string, { value: unknown; expiresAt: number }>();
const inFlight = new Map<string, Promise<unknown>>();

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

  // If there's already an in-flight request for this key, wait for it
  const existing = inFlight.get(key);
  if (existing) {
    return existing as Promise<T>;
  }

  // Create the fetch promise and store it so concurrent callers can share it
  const fetchPromise = fetchFn()
    .then((value) => {
      cache.set(key, { value, expiresAt: Date.now() + ttlMs });
      return value;
    })
    .finally(() => {
      // Clean up in-flight tracking whether success or failure
      inFlight.delete(key);
    });

  inFlight.set(key, fetchPromise);

  return fetchPromise as Promise<T>;
}

export function clearCache(): void {
  cache.clear();
  inFlight.clear();
}

export function getCacheSize(): number {
  return cache.size;
}
