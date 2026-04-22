# Hint 2 (Medium)

Instead of dumping the entire config into the response, create an explicit allowlist of safe fields. Only include values like `port`, `nodeEnv`, and `logLevel` that don't contain secrets. Remove `dbPassword`, `apiKey`, `jwtSecret`, and `redisUrl` from the response entirely.
