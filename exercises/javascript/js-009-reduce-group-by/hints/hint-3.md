# Hint 3 -- Strong

Replace the overwrite pattern with an initialize-then-push pattern:

```typescript
if (!acc[key]) {
  acc[key] = [];
}
acc[key].push(item);
```

For `countBy`, replace `acc[key] = 1` with:

```typescript
acc[key] = (acc[key] || 0) + 1;
```
