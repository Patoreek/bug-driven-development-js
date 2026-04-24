# Hint 2 -- Medium

The spread operator and `Object.assign` only perform a **shallow** clone. Nested objects are shared references. You need a **deep** clone -- look into `structuredClone()`, which is built into modern JavaScript and performs a true deep copy.

Also, `Object.assign(base, overrides)` mutates `base` directly. The first argument to `Object.assign` is the target and gets modified in place.
