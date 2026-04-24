# Hint 3

Replace each pattern:

```ts
// .filter()[0] ?? null  =>  .find()
return users.find((u) => u.email === email);

// .filter().length > 0  =>  .some()
return users.some((u) => u.role === "admin");
```

Remove the `?? null` — `.find()` already returns `undefined` when not found, which is what the callers expect.
