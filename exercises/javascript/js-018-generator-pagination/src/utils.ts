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
 * Should yield individual items one at a time, fetching the next page
 * only when the current page's items are exhausted.
 *
 * BUG 1: Uses `yield` instead of `yield*` for the items array,
 * which yields the entire array as a single value instead of
 * yielding each item individually.
 *
 * BUG 2: Doesn't stop when there are no more pages (nextCursor is null).
 * The loop condition is wrong, causing an infinite loop or extra fetch.
 */
export async function* paginatedFetch<T>(
  fetchPage: FetchPage<T>
): AsyncGenerator<T> {
  let cursor: string | null = null;

  // BUG: Uses `do...while(true)` without a proper break condition.
  // Should stop when nextCursor is null AFTER processing the last page.
  do {
    const page = await fetchPage(cursor);

    // BUG: `yield page.items` yields the entire array as one value.
    // Should use `yield*` to delegate to the array's iterator,
    // yielding each item individually.
    yield page.items as unknown as T;

    cursor = page.nextCursor;
  } while (true);  // BUG: Never exits the loop!
}

/**
 * Takes the first N items from an async iterable.
 *
 * BUG 3: Doesn't properly return/cleanup the underlying async generator
 * when done, which can leave resources (pending fetches) dangling.
 * Also has an off-by-one error in the count.
 */
export async function takeAsync<T>(
  iterable: AsyncIterable<T>,
  n: number
): Promise<T[]> {
  const results: T[] = [];

  // BUG: Uses `<=` instead of `<`, taking n+1 items instead of n.
  // Also doesn't call iterator.return() to signal early termination.
  const iterator = iterable[Symbol.asyncIterator]();

  for (let i = 0; i <= n; i++) {
    const { value, done } = await iterator.next();
    if (done) break;
    results.push(value);
  }

  // BUG: Missing iterator.return() call to clean up the generator.
  // Without this, the generator stays suspended and any resources
  // it holds (pending promises, open connections) are never released.

  return results;
}

/**
 * Transforms each item from an async iterable using a mapping function.
 *
 * BUG 4: The generator yields the promise from mapFn instead of
 * awaiting it first, producing Promise objects instead of resolved values.
 */
export async function* mapAsync<T, U>(
  iterable: AsyncIterable<T>,
  mapFn: (item: T) => Promise<U> | U
): AsyncGenerator<U> {
  for await (const item of iterable) {
    // BUG: Should await the result of mapFn before yielding.
    // Without await, if mapFn returns a Promise, the generator
    // yields the Promise object itself instead of its resolved value.
    yield mapFn(item) as unknown as U;
  }
}
