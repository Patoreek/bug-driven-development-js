# Environment Variable Exposure

**ID:** `be-008-env-var-exposure`  
**Difficulty:** ★★☆☆☆  
**Estimated Time:** 15 minutes  
**Tags:** `security`, `configuration`, `env-vars`, `api`, `information-disclosure`  
**Prerequisites:** None

---

## The Scenario

Your team's API has a `/health` endpoint used by monitoring tools. During a routine security review, someone noticed that the health check response includes the full application configuration -- including database passwords, API keys, and JWT secrets. Anyone who can hit the health endpoint can steal production credentials.

## The Bug

The `getHealthCheck` function dumps every configuration value into the response without filtering. Sensitive values like `dbPassword`, `apiKey`, `jwtSecret`, and `redisUrl` are exposed to anyone who calls the endpoint. Only non-sensitive operational info (port, environment, log level) should be included.

## Your Task

1. Fix `src/config.ts` so the health check only returns safe, non-sensitive config values
2. Remove any fields that contain secrets, passwords, keys, tokens, or internal URLs
3. Ensure all tests pass
4. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/config.ts` | App configuration and health check endpoint |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [OWASP Information Disclosure](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/01-Information_Gathering/) -- information leakage risks
- [12-Factor App: Config](https://12factor.net/config) -- environment-based configuration
- [CWE-200: Information Exposure](https://cwe.mitre.org/data/definitions/200.html) -- exposure of sensitive information
