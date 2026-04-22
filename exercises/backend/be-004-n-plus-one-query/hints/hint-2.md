# Hint 2 (Medium)

Instead of looping through users and calling `SELECT_POSTS_BY_USER` for each one, collect all user IDs into an array and make a single `SELECT_POST_COUNTS_BY_USERS` query with all IDs at once.

The mock database already supports this operation — look at the test file's `createMockDb` to see what operations are available.
