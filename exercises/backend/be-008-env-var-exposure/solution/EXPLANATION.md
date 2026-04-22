# Explanation: Environment Variable Exposure

## The Bug

The `getHealthCheck` function returned the complete application configuration, including sensitive secrets:

```ts
config: {
  port: config.port,
  nodeEnv: config.nodeEnv,
  dbHost: config.dbHost,
  dbPassword: config.dbPassword,       // LEAKED!
  apiKey: config.apiKey,               // LEAKED!
  jwtSecret: config.jwtSecret,         // LEAKED!
  redisUrl: config.redisUrl,           // LEAKED!
  logLevel: config.logLevel,
},
```

Anyone who could access the health endpoint -- which is often unauthenticated -- could harvest database passwords, API keys, and JWT signing secrets.

## The Fix

Only expose non-sensitive operational information in the health check:

```ts
config: {
  port: config.port,
  nodeEnv: config.nodeEnv,
  logLevel: config.logLevel,
},
```

The principle is simple: use an **allowlist** of safe fields rather than dumping everything. Never include passwords, keys, secrets, tokens, or internal connection strings in any externally-accessible response.

## Key Takeaway

Debug and health endpoints are common sources of information disclosure. Always use an explicit allowlist of safe fields rather than exposing the full configuration. This is particularly critical because health endpoints are often left unauthenticated (since monitoring tools need to reach them). In the OWASP Top 10, this falls under "Security Misconfiguration."

## References

- [OWASP: Security Misconfiguration](https://owasp.org/Top10/A05_2021-Security_Misconfiguration/)
- [12-Factor App: Config](https://12factor.net/config)
- [CWE-200: Exposure of Sensitive Information](https://cwe.mitre.org/data/definitions/200.html)

## Interview Context

Information disclosure through debug endpoints is a common security interview topic. The key insight is that secrets should never be included in API responses, logs, or error messages. Interviewers want to hear about the "principle of least privilege" applied to data exposure: only return what the consumer actually needs.
