export type CacheEntry<T = unknown> = {
  data: T;
  timestamp: number;
  maxAge: number;
};

export type MutateOptions<T> = {
  optimisticData?: T;
  revalidate?: boolean;
};

// Simple SWR-style cache
export function createCache() {
  const cache = new Map<string, CacheEntry>();
  const fetchers = new Map<string, () => Promise<unknown>>();

  function set<T>(key: string, data: T, maxAge: number = 60000) {
    cache.set(key, { data, timestamp: Date.now(), maxAge });
  }

  function get<T>(key: string): T | undefined {
    const entry = cache.get(key);
    if (!entry) return undefined;

    // BUG: Never checks if the entry is stale
    return entry.data as T;
  }

  function isStale(key: string): boolean {
    const entry = cache.get(key);
    if (!entry) return true;
    return Date.now() - entry.timestamp > entry.maxAge;
  }

  function registerFetcher(key: string, fetcher: () => Promise<unknown>) {
    fetchers.set(key, fetcher);
  }

  // BUG: mutate does not update related cache keys
  async function mutate<T>(
    key: string,
    options: MutateOptions<T> = {}
  ): Promise<T | undefined> {
    if (options.optimisticData !== undefined) {
      set(key, options.optimisticData);
    }

    if (options.revalidate !== false) {
      const fetcher = fetchers.get(key);
      if (fetcher) {
        const freshData = await fetcher();
        set(key, freshData);
        return freshData as T;
      }
    }

    return get<T>(key);
  }

  // BUG: useSWR-style getter that doesn't revalidate stale entries
  async function getOrFetch<T>(key: string): Promise<T | undefined> {
    const cached = get<T>(key);
    if (cached !== undefined) {
      // BUG: Returns stale data without revalidating
      return cached;
    }

    const fetcher = fetchers.get(key);
    if (!fetcher) return undefined;

    const data = await fetcher();
    set(key, data);
    return data as T;
  }

  function clear() {
    cache.clear();
    fetchers.clear();
  }

  return { set, get, isStale, registerFetcher, mutate, getOrFetch, clear };
}
