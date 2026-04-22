# Hint 1 (Mild)

The rate limiter uses `X-Forwarded-For` to determine the client IP. But who sets that header? Can you trust it from just anyone? Think about which network hops are under your control and which aren't.
