# Hint 3

Replace `.map()` with `.flatMap()` in all three functions:

```ts
// Tags: flatMap + Set for uniqueness
const allTags = posts.flatMap((post) => post.tags);
return [...new Set(allTags)].sort();

// Orders: flatMap to flatten the inner map
return orders.flatMap((order) =>
  order.items.map((item) => ({ orderId: order.orderId, item }))
);

// Words: flatMap with split, then filter empty strings
return sentences.flatMap((s) => s.split(" ")).filter((w) => w !== "");
```
