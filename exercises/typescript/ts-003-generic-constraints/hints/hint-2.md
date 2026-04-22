# Hint 2 (Medium)

Use the `extends` keyword to add constraints:

- `T extends { id: string }` ensures `T` has an `id` property
- `K extends keyof T` ensures `K` is a valid key of `T`
- `T extends object` ensures `T` is an object, not a primitive

For `pluck`, the return type should be `T[K][]` instead of `unknown[]` -- this is called an "indexed access type."
