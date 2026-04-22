# Hint 3 (Strong)

In `getClientIp`, wrap the `X-Forwarded-For` logic in a trusted proxy check:

```ts
getClientIp(req: RequestInfo): string {
  if (this.config.trustedProxies.includes(req.remoteAddress)) {
    const forwarded = req.headers["x-forwarded-for"];
    if (forwarded) {
      return forwarded.split(",")[0].trim();
    }
  }
  return req.remoteAddress;
}
```

Only when the request arrives from a trusted proxy IP should you read `X-Forwarded-For`. Otherwise, use `remoteAddress` directly.
