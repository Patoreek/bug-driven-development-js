# Hint 3 -- Strong

Here are all the fixes:

**cloneAppState** -- separate functions before cloning:
```typescript
export function cloneAppState(state: AppState): AppState {
  const { handlers, ...data } = state;
  const clonedData = structuredClone(data);
  return {
    ...clonedData,
    handlers: {
      onUpdate: handlers.onUpdate,
      onError: handlers.onError,
    },
  };
}
```

**cloneConfigWithOverrides** -- use structuredClone instead of JSON:
```typescript
// Before
const cloned = JSON.parse(JSON.stringify(config)) as Config;

// After
const cloned = structuredClone(config);
```

**createSnapshot** -- use structuredClone instead of spread:
```typescript
// Before
return { ...obj } as T;

// After
return structuredClone(obj);
```
