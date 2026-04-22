# Hint 1 (Mild)

Look at the `text` field of each returned query. Can you see user-supplied values directly inside the SQL string? What would happen if someone passed `'; DROP TABLE users; --` as a name?

The `params` array exists but is always empty. That's a clue.
