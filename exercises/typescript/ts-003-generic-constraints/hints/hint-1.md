# Hint 1 (Mild)

Look at the `Repository` class. It needs every item to have an `id: string` field, but the generic `T` doesn't enforce that. The code works around this with `as any` casts to access `item.id`.

Think about what you could write after `T` to tell TypeScript that `T` must have an `id` property.
