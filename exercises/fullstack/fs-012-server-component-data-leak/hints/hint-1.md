# Hint 1 (Mild)

Look at the `fetch` calls in `api.ts`. What caching behavior does Next.js use by default when no `cache` option is specified? What happens when two different users hit the same URL?

Also look at `getDashboardCacheKey()` — does it actually differentiate between users?
