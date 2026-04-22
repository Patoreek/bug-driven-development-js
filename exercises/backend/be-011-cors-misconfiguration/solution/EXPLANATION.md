# Solution: CORS Misconfiguration

## The Bug

The CORS middleware had several critical issues:

1. **Wildcard + Credentials:** Setting `Access-Control-Allow-Origin: *` with `Access-Control-Allow-Credentials: true` is explicitly forbidden by the CORS spec. Browsers will reject the response entirely.

2. **No origin validation:** The middleware didn't check whether the requesting origin was on an allowlist. It accepted every origin.

3. **No preflight handling:** OPTIONS requests weren't detected or handled. Without `Access-Control-Allow-Methods` and `Access-Control-Allow-Headers`, the browser blocks non-simple requests (those with custom headers or methods like PUT/DELETE).

## The Fix

1. **Validate origin:** Check if the request's `Origin` header is in the `ALLOWED_ORIGINS` array. Only set CORS headers if it matches:
```ts
if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
  return { headers, isPreflight };
}
headers["Access-Control-Allow-Origin"] = origin; // echo the specific origin
```

2. **Handle preflight:** Detect OPTIONS requests and add the required preflight headers:
```ts
if (isPreflight) {
  headers["Access-Control-Allow-Methods"] = ALLOWED_METHODS.join(", ");
  headers["Access-Control-Allow-Headers"] = ALLOWED_HEADERS.join(", ");
  headers["Access-Control-Max-Age"] = "86400";
}
```

3. **Never use wildcard with credentials:** By echoing the specific allowed origin instead of `*`, credentials work correctly.

## Key Takeaway

CORS is a browser security feature, not a server security feature -- but misconfiguring it can either break your frontend or expose your API to cross-origin attacks. Always validate origins against an explicit allowlist, handle preflight OPTIONS requests, and never combine `*` with credentials.
