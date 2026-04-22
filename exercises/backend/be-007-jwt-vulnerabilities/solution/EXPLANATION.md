# Explanation: JWT Verification Vulnerabilities

## The Bug

The `verifyJwt` function had three critical security vulnerabilities:

### 1. Algorithm "none" Accepted
```ts
if (header.alg === "none") {
  return { valid: true, payload }; // Skips all verification!
}
```
An attacker could set `alg: "none"` in the JWT header and omit the signature entirely. The server would accept the token without any cryptographic verification, allowing the attacker to forge tokens with arbitrary claims (e.g., `role: "admin"`).

### 2. No Expiration Check
The function never checked the `exp` (expiration) claim. Once a JWT was issued, it remained valid forever -- even if it was stolen or the user's account was compromised.

### 3. No Issuer Validation
The function never checked the `iss` (issuer) claim. Tokens minted by a completely different service would be accepted, breaking the trust boundary.

## The Fix

1. **Algorithm allowlist:** Replace the `"none"` special case with a strict allowlist:
```ts
const ALLOWED_ALGORITHMS = new Set(["HS256"]);
if (!ALLOWED_ALGORITHMS.has(header.alg)) {
  return { valid: false, error: `Unsupported algorithm: ${header.alg}` };
}
```

2. **Expiration validation:** Check the `exp` claim against the current time:
```ts
if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
  return { valid: false, error: "Token expired" };
}
```

3. **Issuer validation:** Verify the `iss` claim matches the expected value:
```ts
if (!payload.iss || payload.iss !== EXPECTED_ISSUER) {
  return { valid: false, error: "Invalid issuer" };
}
```

## Key Takeaway

JWT verification must be defense-in-depth: validate the algorithm against an allowlist (never a denylist), always check expiration, and always validate the issuer. The "alg: none" attack is one of the most well-known JWT vulnerabilities and has affected real-world libraries like `jsonwebtoken` for Node.js.

## References

- [JWT.io Introduction](https://jwt.io/introduction)
- [Auth0: Critical JWT Vulnerabilities](https://auth0.com/blog/critical-vulnerabilities-in-json-web-token-libraries/)
- [OWASP JWT Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)

## Interview Context

JWT security is a frequent interview topic. Interviewers expect you to know about the "none" algorithm attack, the importance of checking `exp`/`iss`/`aud` claims, and why you should use an allowlist (not denylist) for algorithms. Understanding that JWTs are signed but not encrypted is also important.
