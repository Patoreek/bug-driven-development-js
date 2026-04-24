# Timing Attack: Insecure Token Comparison

**ID:** `be-019-timing-attack`  
**Difficulty:** ★★★★☆  
**Estimated Time:** 25 minutes  
**Tags:** `security`, `timing-attack`, `crypto`, `authentication`, `constant-time`  
**Prerequisites:** None

---

## The Scenario

Your API uses bearer tokens for authentication. A security audit flags the token validation as vulnerable to **timing attacks**. The `===` operator compares strings character-by-character and returns `false` as soon as it finds a mismatch. An attacker can measure response time differences (even microseconds) to determine how many leading characters of their guess match the real token, effectively brute-forcing it one character at a time.

## The Bug

Both `safeCompare` and `validateToken` use JavaScript's `===` operator for string comparison. This is a **short-circuit comparison** -- it exits at the first mismatching byte. An attacker sending thousands of requests with different prefixes can statistically determine the correct token by measuring which guesses take slightly longer (because more characters matched before the mismatch).

## Your Task

1. Rewrite `safeCompare` to use constant-time comparison (same duration regardless of where strings differ)
2. Update `validateToken` to use your fixed `safeCompare` instead of `===`
3. Handle edge cases: different-length strings should not leak length info
4. All tests must pass

## Files to Modify

| File | Description |
|------|-------------|
| `src/auth.ts` | Token validation with insecure comparison |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [crypto.timingSafeEqual](https://nodejs.org/api/crypto.html#cryptotimingsafeequala-b) -- Node.js constant-time comparison
- [Timing attacks explained](https://codahale.com/a-lesson-in-timing-attacks/) -- classic blog post
- [OWASP: Timing attacks](https://owasp.org/www-community/attacks/Timing_attack) -- security reference
