# Hint 3 (Strong)

Here's the structure of the fix:

```ts
const origin = request.headers.origin;
const isPreflight = request.method === "OPTIONS";

if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
  return { headers, isPreflight };
}

headers["Access-Control-Allow-Origin"] = origin;
headers["Access-Control-Allow-Credentials"] = "true";

if (isPreflight) {
  headers["Access-Control-Allow-Methods"] = ALLOWED_METHODS.join(", ");
  headers["Access-Control-Allow-Headers"] = ALLOWED_HEADERS.join(", ");
  headers["Access-Control-Max-Age"] = "86400";
}
```
