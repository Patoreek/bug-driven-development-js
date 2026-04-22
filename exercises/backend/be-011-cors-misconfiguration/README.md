# CORS Misconfiguration

**ID:** `be-011-cors-misconfiguration`  
**Difficulty:** ★★★☆☆  
**Estimated Time:** 20 minutes  
**Tags:** `cors`, `security`, `http-headers`, `preflight`, `options`  
**Prerequisites:** None

---

## The Scenario

Your team's API is being consumed by a frontend app at `https://app.example.com`. Users are reporting that some requests work fine but others fail with CORS errors in the browser console. The security team has also flagged that the current CORS configuration allows wildcard origins combined with credentials, which is a security vulnerability. You need to fix the CORS middleware so it works correctly and securely.

## The Bug

The CORS headers function has multiple issues:
- It sets `Access-Control-Allow-Origin: *` while also setting `Access-Control-Allow-Credentials: true` (browsers reject this combination)
- It doesn't handle preflight `OPTIONS` requests at all
- It doesn't validate the requesting origin against an allowlist
- It's missing required `Access-Control-Allow-Headers` and `Access-Control-Allow-Methods` headers

## Your Task

1. Examine `src/cors.ts` and identify the CORS configuration issues
2. Implement proper origin validation against an allowlist
3. Handle preflight OPTIONS requests correctly
4. Set all required CORS headers
5. Ensure all tests pass
6. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/cors.ts` | CORS headers middleware function |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) -- Cross-Origin Resource Sharing overview
- [Preflight Requests](https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request) -- when and why OPTIONS requests happen
- [Access-Control headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin) -- header reference
