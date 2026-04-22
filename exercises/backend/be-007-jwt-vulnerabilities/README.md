# JWT Verification Vulnerabilities

**ID:** `be-007-jwt-vulnerabilities`  
**Difficulty:** ★★★★☆  
**Estimated Time:** 25 minutes  
**Tags:** `security`, `jwt`, `authentication`, `tokens`, `cryptography`  
**Prerequisites:** None

---

## The Scenario

Your company's API uses JSON Web Tokens (JWT) for authentication. A security audit found that the JWT verification function has critical flaws: it accepts unsigned tokens with `alg: "none"`, doesn't check if tokens have expired, and doesn't validate the issuer claim. An attacker can forge tokens to impersonate any user with any role.

## The Bug

The `verifyJwt` function has three vulnerabilities:
1. It accepts tokens with `alg: "none"`, which means no signature is required -- an attacker can craft any payload
2. It never checks the `exp` (expiration) claim, so stolen tokens remain valid forever
3. It never validates the `iss` (issuer) claim, so tokens from untrusted issuers are accepted

## Your Task

1. Fix `src/jwt.ts` to reject tokens using the `"none"` algorithm
2. Add expiration validation -- reject tokens where `exp` is in the past
3. Add issuer validation -- reject tokens where `iss` doesn't match the expected issuer
4. Ensure all tests pass
5. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/jwt.ts` | JWT signing and verification with security vulnerabilities |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [JWT.io Introduction](https://jwt.io/introduction) -- JWT structure and claims
- [OWASP JWT Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html) -- common JWT vulnerabilities
- [Algorithm None Attack](https://auth0.com/blog/critical-vulnerabilities-in-json-web-token-libraries/) -- why "none" is dangerous
