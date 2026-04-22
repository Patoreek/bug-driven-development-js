# Hint 2 (Medium)

You need three fixes in `verifyJwt`:

1. **Algorithm allowlist:** Instead of special-casing `"none"`, maintain a `Set` of allowed algorithms (e.g., just `"HS256"`) and reject anything not in the set.
2. **Expiration check:** After signature verification, check if `payload.exp` exists and is greater than `Math.floor(Date.now() / 1000)`.
3. **Issuer check:** Verify that `payload.iss` matches the `EXPECTED_ISSUER` constant.
