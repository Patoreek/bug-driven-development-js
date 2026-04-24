# Hint 3 (Strong)

Add this check at the top of the loop in `deepMerge`:

```ts
const DANGEROUS_KEYS = new Set(["__proto__", "constructor", "prototype"]);

for (const key of Object.keys(source)) {
  if (DANGEROUS_KEYS.has(key)) {
    continue;  // Skip dangerous keys entirely
  }
  // ... rest of merge logic
}
```

This prevents any writes to prototype-chain properties while still merging all legitimate keys. An alternative is using `Object.hasOwn(source, key)` combined with checking `key !== '__proto__'`, but the blocklist approach is more comprehensive.
