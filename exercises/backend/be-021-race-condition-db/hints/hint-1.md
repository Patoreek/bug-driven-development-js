# Hint 1 (Mild)

The account object already has a `version` field. In a real database, you'd add `WHERE version = ?` to your UPDATE statement to detect concurrent modifications. If the version changed between your read and write, someone else wrote first and your update should fail. Think about how to simulate this with the in-memory store.
