# Hint 3 (Strong)

Replace the `alg === "none"` bypass and add the missing checks:

```ts
const ALLOWED_ALGORITHMS = new Set(["HS256"]);

// In verifyJwt, after parsing header and payload:

// Reject unsupported algorithms (including "none")
if (!ALLOWED_ALGORITHMS.has(header.alg)) {
  return { valid: false, error: `Unsupported algorithm: ${header.alg}` };
}

// After signature check:
if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
  return { valid: false, error: "Token expired" };
}

if (!payload.iss || payload.iss !== EXPECTED_ISSUER) {
  return { valid: false, error: "Invalid issuer" };
}
```
