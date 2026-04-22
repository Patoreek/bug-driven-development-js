# Hint 2 (Medium)

`fetchConfig` is an object literal created on every render. Even though `{ userId: 1, includeRole: true }` has the same values each time, `{} !== {}` in JavaScript because objects are compared by reference. React's dependency check uses `Object.is`, which has the same behavior.
