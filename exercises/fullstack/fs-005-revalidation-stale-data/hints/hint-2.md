# Hint 2 (Medium)

After every mutation (add or delete), you need to invalidate the cache so the next call to `getBookmarks` fetches fresh data. Setting the cache variable to `null` forces a re-read on the next access.
