# Hint 2 (Medium)

Before performing the optimistic update, save a snapshot of the current `state.todos`. If the server call fails, restore that snapshot. This is the standard "save previous state, rollback on failure" pattern.
