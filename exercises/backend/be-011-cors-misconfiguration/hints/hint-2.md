# Hint 2 (Medium)

Instead of `*`, echo back the specific origin from the request's `Origin` header -- but only if it's in the `ALLOWED_ORIGINS` array. If the origin isn't allowed, don't set any CORS headers at all. Also, check `request.method` to detect preflight OPTIONS requests.
