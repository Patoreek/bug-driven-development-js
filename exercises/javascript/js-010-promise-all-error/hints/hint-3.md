# Hint 3 -- Strong

Replace `Promise.all` with `Promise.allSettled`, then iterate over the results:

```typescript
const settlements = await Promise.allSettled(ids.map(id => fetchUser(id)));

settlements.forEach((settlement, index) => {
  if (settlement.status === "fulfilled") {
    succeeded.push(settlement.value);
  } else {
    failed.push({ id: ids[index], error: settlement.reason.message });
  }
});
```

Apply the same pattern to `batchProcess`.
