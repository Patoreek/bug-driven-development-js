# Hint 3 -- Strong

Here are all the fixes:

**paginatedFetch** -- yield items individually and exit the loop:
```typescript
do {
  const page = await fetchPage(cursor);

  // yield* instead of yield
  yield* page.items;

  cursor = page.nextCursor;
} while (cursor !== null);  // Exit when no more pages
```

**takeAsync** -- fix off-by-one and clean up:
```typescript
for (let i = 0; i < n; i++) {  // < not <=
  const { value, done } = await iterator.next();
  if (done) break;
  results.push(value);
}
// Clean up the generator
await iterator.return?.(undefined);
```

**mapAsync** -- await the mapping function:
```typescript
for await (const item of iterable) {
  yield await mapFn(item);  // Add await
}
```
