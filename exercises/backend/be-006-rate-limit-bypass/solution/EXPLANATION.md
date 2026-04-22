# Explanation: Rate Limiter Bypass

## The Bug

The `getClientIp` method blindly trusted the `X-Forwarded-For` header from any client:

```ts
getClientIp(req: RequestInfo): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.remoteAddress;
}
```

Since any HTTP client can set arbitrary headers, an attacker could send a different `X-Forwarded-For` value on each request, making the rate limiter think each request came from a unique IP. This completely defeats the purpose of rate limiting.

## The Fix

Check whether `req.remoteAddress` is in the `trustedProxies` list before reading `X-Forwarded-For`:

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

Now only requests arriving through a known load balancer or reverse proxy will have `X-Forwarded-For` honored. Direct connections from untrusted IPs always use the socket-level `remoteAddress`, which cannot be spoofed.

## Key Takeaway

Never trust client-supplied headers for security decisions unless you have verified the source. The `X-Forwarded-For` header is trivially spoofable. Frameworks like Express have a `trust proxy` setting for exactly this reason. Always configure an explicit list of trusted proxy IPs.

## References

- [MDN: X-Forwarded-For](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Forwarded-For)
- [Express.js: Behind Proxies](https://expressjs.com/en/guide/behind-proxies.html)
- [OWASP: Blocking Brute Force Attacks](https://owasp.org/www-community/controls/Blocking_Brute_Force_Attacks)

## Interview Context

IP spoofing via `X-Forwarded-For` is a common topic in security interviews. Interviewers want to hear that you understand the difference between the TCP source address (which requires network-level spoofing) and HTTP headers (which any client can set). The solution pattern -- trusting forwarded headers only from known proxies -- is used by every major web framework.
