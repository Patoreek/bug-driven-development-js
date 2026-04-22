# Hint 1 (Mild)

Count the number of `db.query()` calls. With 3 users, the current code makes 4 queries (1 + 3). With 500 users, it would make 501 queries. Can you think of a way to get all the post counts in a single query?
