/**
 * Simulates a paginated API that returns pages of items.
 * Each page has items and a cursor for the next page.
 */
export interface Page<T> {
  items: T[];
  nextCursor: string | null;
}

export type FetchPage<T> = (cursor: string | null) => Promise<Page<T>>;

/**
 * An async generator that lazily fetches pages from a paginated API.
 * Yields individual items one at a time, fetching the next page
 * only when the current page's items are exhausted.
 *
 * FIX 1: Uses `yield*` to yield individual items from each page.
 * FIX 2: Properly exits the loop when nextCursor is null.
 */
export async function* paginatedFetch<T>(
  fetchPage: FetchPage<T>
): AsyncGenerator<T> {
  let cursor: string | null = null;

  do {
    const page = await fetchPage(cursor);

    // FIX: Use `yield*` to delegate to the array's iterator,
    // yielding each item individually instead of the whole array.
    yield* page.items;

    cursor = page.nextCursor;
    // FIX: Exit the loop when there are no more pages.
  } while (cursor !== null);
}

/**
 * Takes the first N items from an async iterable.
 *
 * FIX 3: Uses `<` instead of `<=` to take exactly n items.
 * FIX: Calls iterator.return() to clean up the generator.
 */
export async function takeAsync<T>(
  iterable: AsyncIterable<T>,
  n: number
): Promise<T[]> {
  const results: T[] = [];

  const iterator = iterable[Symbol.asyncIterator]();

  // FIX: Use `<` not `<=` to take exactly n items
  for (let i = 0; i < n; i++) {
    const { value, done } = await iterator.next();
    if (done) break;
    results.push(value);
  }

  // FIX: Call return() to signal the generator that we're done,
  // allowing it to clean up resources (pending fetches, etc.)
  await iterator.return?.(undefined);

  return results;
}

/**
 * Transforms each item from an async iterable using a mapping function.
 *
 * FIX 4: Awaits the result of mapFn before yielding.
 */
export async function* mapAsync<T, U>(
  iterable: AsyncIterable<T>,
  mapFn: (item: T) => Promise<U> | U
): AsyncGenerator<U> {
  for await (const item of iterable) {
    // FIX: Await the mapFn result so we yield the resolved value,
    // not the Promise itself.
    yield await mapFn(item);
  }
}
