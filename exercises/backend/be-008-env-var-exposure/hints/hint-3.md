# Hint 3 (Strong)

Replace the config section in `getHealthCheck` with only the safe values:

```ts
return {
  status: "ok",
  uptime: uptimeSeconds,
  config: {
    port: config.port,
    nodeEnv: config.nodeEnv,
    logLevel: config.logLevel,
  },
};
```

Remove `dbPassword`, `apiKey`, `jwtSecret`, `redisUrl`, and `dbHost` from the response.
