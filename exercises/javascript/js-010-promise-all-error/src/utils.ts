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
 * Should return partial results -- successful fetches should not be
 * lost just because one request fails.
 *
 * @param ids - Array of user IDs to fetch
 * @param fetchUser - Function that fetches a single user (may reject)
 * @returns Object with succeeded users and failed request info
 */
export async function fetchAllUsers(
  ids: string[],
  fetchUser: (id: string) => Promise<User>
): Promise<FetchResult<User>> {
  // BUG: Promise.all rejects entirely if any single promise rejects.
  // All successful results are lost.
  const users = await Promise.all(ids.map((id) => fetchUser(id)));

  return {
    succeeded: users,
    failed: [],
  };
}

/**
 * Processes an array of items in parallel using a processing function.
 * Should collect results and errors separately -- one failure should not
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
  // BUG: Same problem -- one rejection kills everything
  const results = await Promise.all(items.map((item) => processFn(item)));

  return {
    results,
    errors: [],
  };
}
