# Hint 2 (Medium)

The `X-Forwarded-For` header should only be trusted when the direct connection (`remoteAddress`) comes from a known, trusted proxy. The `RateLimiterConfig` already has a `trustedProxies` array -- you need to check if `req.remoteAddress` is in that list before reading the forwarded header.
