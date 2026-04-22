# Hint 1 (Mild)

The runtime behavior of all the functions is already correct -- `isCat` correctly checks `animal.kind === "cat"`. The problem is purely in the type system.

Look at the return type of `isCat`. When it returns `boolean`, TypeScript doesn't learn anything about the type of `animal` after the check. What would you change in the function signature to tell TypeScript "if this returns true, then `animal` is a `Cat`"?
