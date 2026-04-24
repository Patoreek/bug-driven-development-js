# Hint 3 -- Strong

Replace all shallow copies with `structuredClone()`:

```typescript
// cloneConfig
return structuredClone(config);

// updateNestedSetting
const updated = structuredClone(config);
// ... then mutate updated (it's a completely independent copy)

// mergeConfigs
const merged = structuredClone(base);
// Apply overrides to merged instead of mutating base
```

For `mergeConfigs`, the key fix is to NOT pass `base` as the first argument to `Object.assign`, since that mutates `base`. Clone it first.
