# Logging Sensitive Data

**ID:** `be-015-logging-sensitive-data`  
**Difficulty:** ★★☆☆☆  
**Estimated Time:** 15 minutes  
**Tags:** `security`, `logging`, `pii`, `data-sanitization`, `redaction`  
**Prerequisites:** None

---

## The Scenario

During a routine security review, the team discovered that the application logger is writing full request bodies to log files -- including passwords, API tokens, and credit card numbers. This is a PII (Personally Identifiable Information) compliance violation. You need to add a sanitization layer that redacts sensitive fields before they're written to logs.

## The Bug

The `sanitize` function is supposed to redact sensitive fields from objects before logging, but it currently returns the input unchanged. The `logRequest` function passes the raw request body to the logger without any sanitization.

## Your Task

1. Examine `src/logger.ts` and identify where sensitive data leaks into logs
2. Implement the `sanitize` function to redact sensitive fields (replace values with `"[REDACTED]"`)
3. Apply sanitization in `logRequest` before logging
4. Handle nested objects recursively
5. Ensure all tests pass
6. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/logger.ts` | Logger with sensitive data exposure |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [OWASP Logging Guide](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html) -- what to log and what not to log
- [PII and GDPR](https://gdpr.eu/eu-gdpr-personal-data/) -- personal data protection requirements
- [Structured Logging](https://www.structlog.org/en/stable/why.html) -- logging best practices
