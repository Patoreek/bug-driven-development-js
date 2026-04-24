export interface User {
  id: string;
  name: string;
  email: string;
}

export interface FetchResult<T> {
  succeeded: T[];
  failed: { id: string; error: string }[];
}

export interface BatchResult<T> {
  results: T[];
  errors: { item: unknown; error: string }[];
}

/**
 * Fetches user data for multiple user IDs in parallel.
 * Returns partial results -- successful fetches are preserved
 * even when some requests fail.
 *
 * @param ids - Array of user IDs to fetch
 * @param fetchUser - Function that fetches a single user (may reject)
 * @returns Object with succeeded users and failed request info
 */
export async function fetchAllUsers(
  ids: string[],
  fetchUser: (id: string) => Promise<User>
): Promise<FetchResult<User>> {
  // FIX: Use Promise.allSettled to get results for all promises,
  // regardless of whether they fulfilled or rejected.
  const settlements = await Promise.allSettled(
    ids.map((id) => fetchUser(id))
  );

  const succeeded: User[] = [];
  const failed: { id: string; error: string }[] = [];

  settlements.forEach((settlement, index) => {
    if (settlement.status === "fulfilled") {
      succeeded.push(settlement.value);
    } else {
      failed.push({
        id: ids[index],
        error: settlement.reason?.message || String(settlement.reason),
      });
    }
  });

  return { succeeded, failed };
}

/**
 * Processes an array of items in parallel using a processing function.
 * Collects results and errors separately -- one failure does not
 * prevent other items from being processed.
 *
 * @param items - Items to process
 * @param processFn - Async function to process each item (may reject)
 * @returns Object with successful results and error info
 */
export async function batchProcess<T, R>(
  items: T[],
  processFn: (item: T) => Promise<R>
): Promise<BatchResult<R>> {
  // FIX: Use Promise.allSettled to preserve partial results
  const settlements = await Promise.allSettled(
    items.map((item) => processFn(item))
  );

  const results: R[] = [];
  const errors: { item: unknown; error: string }[] = [];

  settlements.forEach((settlement, index) => {
    if (settlement.status === "fulfilled") {
      results.push(settlement.value);
    } else {
      errors.push({
        item: items[index],
        error: settlement.reason?.message || String(settlement.reason),
      });
    }
  });

  return { results, errors };
}
