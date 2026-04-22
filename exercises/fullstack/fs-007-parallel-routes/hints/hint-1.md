# Hint 1 (Mild)

Look at the `RouteSlot` type. It has `loading` and `error` optional properties. Now look at `resolveSlot` -- does it ever check those properties? And what happens in `getSlotContent` when you access a slot name that is not in the record?
