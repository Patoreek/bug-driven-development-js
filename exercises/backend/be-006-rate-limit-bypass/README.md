# Rate Limiter Bypass

**ID:** `be-006-rate-limit-bypass`  
**Difficulty:** ★★★☆☆  
**Estimated Time:** 20 minutes  
**Tags:** `security`, `rate-limiting`, `headers`, `ip-spoofing`  
**Prerequisites:** None

---

## The Scenario

Your team deployed a rate limiter to protect an API from abuse. It limits each IP to 5 requests per minute. A security researcher reported that the rate limiter can be trivially bypassed by sending a spoofed `X-Forwarded-For` header with a different IP address on each request. The limiter blindly trusts this header, so an attacker can effectively get unlimited requests.

## The Bug

The rate limiter extracts the client IP from the `X-Forwarded-For` header without any verification. Since this header is easily spoofed by clients, an attacker can rotate IP addresses on every request and never hit the rate limit. The limiter should only trust `X-Forwarded-For` when the request comes through a known proxy.

## Your Task

1. Fix `src/rate-limiter.ts` so it only trusts `X-Forwarded-For` from configured trusted proxies
2. When the request is not from a trusted proxy, use the socket address (remoteAddress) instead
3. When the request IS from a trusted proxy, use the leftmost (first) IP in `X-Forwarded-For`
4. Ensure all tests pass
5. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/rate-limiter.ts` | Rate limiter with IP extraction logic |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [X-Forwarded-For](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Forwarded-For) — how this header works and why it's dangerous to trust blindly
- [Express.js trust proxy](https://expressjs.com/en/guide/behind-proxies.html) — how frameworks handle proxy trust
- [OWASP Rate Limiting](https://owasp.org/www-community/controls/Blocking_Brute_Force_Attacks) — rate limiting best practices
