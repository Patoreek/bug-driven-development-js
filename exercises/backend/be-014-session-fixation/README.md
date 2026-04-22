# Session Fixation

**ID:** `be-014-session-fixation`  
**Difficulty:** ★★★★☆  
**Estimated Time:** 25 minutes  
**Tags:** `security`, `session`, `authentication`, `cookies`, `session-fixation`  
**Prerequisites:** None

---

## The Scenario

Your team's security audit has revealed a session fixation vulnerability in the authentication system. An attacker can set a victim's session cookie to a known value (e.g., through a link or XSS on a subdomain), wait for the victim to log in, and then use that same session ID to access the victim's authenticated session. Additionally, the session cookies are missing critical security attributes.

## The Bug

The session management code has two problems:
1. The `login` function authenticates the user but keeps the same session ID that existed before login. This means a pre-login session ID (which an attacker may know) becomes an authenticated session.
2. The `getSessionCookie` function generates cookies without `Secure`, `HttpOnly`, or `SameSite` attributes, making them vulnerable to interception and XSS attacks.

## Your Task

1. Examine `src/session.ts` and identify the session fixation vulnerability
2. Fix `login` to regenerate the session ID after successful authentication
3. Fix `getSessionCookie` to include secure cookie attributes
4. Ensure all tests pass
5. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/session.ts` | Session management with fixation vulnerability |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Session Fixation](https://owasp.org/www-community/attacks/Session_fixation) -- OWASP session fixation overview
- [Secure Cookie Attributes](https://owasp.org/www-community/controls/SecureCookieAttribute) -- HttpOnly, Secure, SameSite
- [Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) -- OWASP best practices
