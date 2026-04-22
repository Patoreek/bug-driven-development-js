# XSS in API Response

**ID:** `be-013-xss-in-api-response`  
**Difficulty:** ★★★☆☆  
**Estimated Time:** 20 minutes  
**Tags:** `security`, `xss`, `sanitization`, `html-encoding`, `injection`  
**Prerequisites:** None

---

## The Scenario

Your team maintains an API endpoint that renders user-generated content into HTML snippets for an email notification service. A security audit has found that user input is being interpolated directly into HTML without any sanitization. An attacker could inject malicious `<script>` tags or event handlers through profile fields like name and bio, which would execute in any email client that renders HTML.

## The Bug

The `renderUserCard` and `renderSearchResults` functions directly interpolate user input into HTML strings without escaping HTML special characters. Characters like `<`, `>`, `"`, `'`, and `&` in user input are passed through as-is, allowing script injection.

## Your Task

1. Examine `src/render.ts` and identify where unsanitized user input is placed into HTML
2. Implement an `escapeHtml` function that encodes the five critical HTML characters
3. Apply the escape function to all user-provided values before interpolation
4. Ensure all tests pass
5. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/render.ts` | HTML rendering functions with XSS vulnerabilities |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Cross-Site Scripting (XSS)](https://owasp.org/www-community/attacks/xss/) -- OWASP XSS overview
- [HTML Entity Encoding](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) -- OWASP prevention cheat sheet
- [Output Encoding](https://developer.mozilla.org/en-US/docs/Glossary/Entity) -- HTML entities reference
