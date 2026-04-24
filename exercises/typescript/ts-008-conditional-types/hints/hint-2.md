# Hint 2 (Medium)

TypeScript has a rule: conditional types **distribute over unions** only when the checked type is a **naked** (unwrapped) type parameter.

- `T extends U ? X : Y` — **distributes**: each member of `T` is checked individually
- `[T] extends [U] ? X : Y` — **does NOT distribute**: checks the whole union at once

Most of the utility types here need distribution (to filter/map each union member), so they should use naked `T`. The exception is `IsNever<T>` — since `never` is the empty union, distributing over it produces `never` (zero iterations), so it needs `[T] extends [never]`.
