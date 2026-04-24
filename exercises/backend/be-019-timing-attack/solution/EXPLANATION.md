# Solution: Timing Attack — Insecure Token Comparison

## Why the Bug Happens

JavaScript's `===` operator compares strings byte-by-byte and returns `false` at the **first mismatch**:

```
"tok_test_a1b2..." === "tok_test_a1b2..." → compares all 36 chars → true (slow)
"tok_test_a1b2..." === "tok_test_XXXX..." → matches 8 chars, fails at char 9 (faster)
"tok_test_a1b2..." === "XX_live_XXXX..." → fails at char 1 (fastest)
```

An attacker can exploit this timing difference. By sending thousands of requests with different first characters and measuring response times, they can determine which character produced the longest response (matching more bytes). Then they move to the second character, and so on.

## The Fix

```ts
import { timingSafeEqual } from "crypto";

export function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    const bufA = Buffer.from(a);
    timingSafeEqual(bufA, bufA); // constant-time no-op to prevent length oracle
    return false;
  }
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}
```

`crypto.timingSafeEqual` compares **every byte** regardless of where mismatches occur, taking the same amount of time for any inputs of equal length.

## Key Details

- `timingSafeEqual` requires buffers of equal length (throws otherwise)
- When lengths differ, we still run a comparison to avoid leaking length info through timing
- The format prefix check (`startsWith("tok_test_")`) is acceptable since it reveals no secret information

## Documentation

- [crypto.timingSafeEqual](https://nodejs.org/api/crypto.html#cryptotimingsafeequala-b)
- [OWASP Timing Attacks](https://owasp.org/www-community/attacks/Timing_attack)

## Common Variations

- Password comparison (should use bcrypt/argon2 which handle this internally)
- HMAC comparison for webhook signatures
- CSRF token validation
- API key rotation checks

## Interview Context

This is a security-focused question that tests:
- Awareness of side-channel attacks beyond SQL injection/XSS
- Knowing that `===` is not safe for secret comparison
- Understanding constant-time algorithms and why they matter
- Knowledge of Node.js crypto APIs
- Thinking about edge cases (different length strings, empty strings)
