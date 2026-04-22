# Hint 2 (Medium)

The hooks are inside an `if (isLoggedIn)` block. When `isLoggedIn` changes from `true` to `false`, the hooks stop being called. React relies on hooks being called in the same order every render — violating this causes crashes or corrupted state.
