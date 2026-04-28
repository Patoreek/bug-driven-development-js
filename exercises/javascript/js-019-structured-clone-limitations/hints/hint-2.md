# Hint 2 -- Medium

Three specific fixes:

1. **`cloneAppState`**: `structuredClone` throws on functions. The solution is to separate the data from the functions: destructure out `handlers`, clone the rest with `structuredClone`, then reattach the handler references. Functions don't need to be deep-cloned -- sharing the reference is correct.

2. **`cloneConfigWithOverrides`**: `JSON.parse(JSON.stringify())` silently destroys `Map`, `Set`, `Date`, and `RegExp`. Since the config contains no functions, `structuredClone(config)` works perfectly and preserves all these types.

3. **`createSnapshot`**: `{ ...obj }` is a shallow copy. Use `structuredClone(obj)` for a true deep copy of plain data objects.
