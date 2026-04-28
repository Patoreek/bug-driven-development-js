# ReDoS: Catastrophic Backtracking in Validation

**ID:** `be-023-regex-dos`  
**Difficulty:** ★★★★☆  
**Estimated Time:** 25 minutes  
**Tags:** `regex`, `security`, `redos`, `validation`, `performance`  
**Prerequisites:** None

---

## The Scenario

Your API has input validation middleware that checks emails, URLs, slugs, and other user inputs using regular expressions. Recently, an attacker discovered they could send a crafted request body that causes the server to hang for 30+ seconds on a single regex match, effectively taking down the entire Node.js event loop. Your PagerDuty is going off because one malicious request is blocking all other requests.

## The Bug

The regex patterns use **nested quantifiers** and **overlapping character classes** that cause exponential backtracking. For example, `^([a-z0-9-]+)+$` looks harmless, but when the input is `"a-a-a-a-a-a-a-a-a-a-a-a-!"`, the regex engine tries every possible way to divide the string among the nested groups before concluding it does not match. Each additional character roughly doubles the number of attempts.

The vulnerable patterns are in `isValidEmail`, `isValidUrl`, `isSafeJsonString`, and `isValidSlug`. Each can be exploited with a crafted input string that causes the regex to run for seconds or minutes.

## Your Task

1. Identify the nested quantifier patterns in each regex (look for `(X+)+`, `(X*)*`, `(X|Y)*` where X and Y overlap)
2. Rewrite each regex to avoid nested quantifiers while preserving validation logic
3. Ensure all validation functions complete in under 50ms even on adversarial inputs
4. All tests must pass -- both the correctness tests and the ReDoS timeout tests

## Files to Modify

| File | Description |
|------|-------------|
| `src/validator.ts` | Validation functions with vulnerable regex patterns |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Regular Expression Denial of Service (ReDoS)](https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS) -- OWASP overview
- [Catastrophic Backtracking](https://www.regular-expressions.info/catastrophic.html) -- detailed explanation of the backtracking problem
- [Node.js Security: ReDoS](https://nodejs.org/en/learn/getting-started/security-best-practices#denial-of-service-of-http-server-redos) -- Node.js official guidance
