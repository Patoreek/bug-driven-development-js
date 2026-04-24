# Hint 3

Copy the array before sorting using the spread operator:

```ts
const sorted = [...scores].sort((a, b) => b - a);
```

Or use the ES2023 non-mutating sort:

```ts
const sorted = scores.toSorted((a, b) => b - a);
```

Other copy techniques: `scores.slice().sort(...)` or `Array.from(scores).sort(...)`.

For `getProductViews`, make sure both `featured` and `byPrice` are separate copies, not references to the original.
