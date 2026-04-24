// BUG: This config module exposes sensitive environment variables
// through a debug/health endpoint without filtering secrets.

export interface AppConfig {
  port: number;
  nodeEnv: string;
  dbHost: string;
  dbPassword: string;
  apiKey: string;
  jwtSecret: string;
  redisUrl: string;
  logLevel: string;
}

export interface HealthResponse {
  status: string;
  uptime: number;
  config: Record<string, string | number>;
}

// Simulated env vars (in real apps these come from process.env)
const env: Record<string, string> = {
  PORT: "3000",
  NODE_ENV: "production",
  DB_HOST: "db.internal.example.com",
  DB_PASSWORD: "s3cret-p@ssw0rd!",
  API_KEY: "tok_test_abc123xyz789",
  JWT_SECRET: "my-jwt-signing-secret",
  REDIS_URL: "redis://cache.internal:6379",
  LOG_LEVEL: "info",
};

/**
 * Loads and returns app configuration from environment variables.
 */
export function loadConfig(): AppConfig {
  return {
    port: parseInt(env.PORT || "3000", 10),
    nodeEnv: env.NODE_ENV || "development",
    dbHost: env.DB_HOST || "localhost",
    dbPassword: env.DB_PASSWORD || "",
    apiKey: env.API_KEY || "",
    jwtSecret: env.JWT_SECRET || "",
    redisUrl: env.REDIS_URL || "redis://localhost:6379",
    logLevel: env.LOG_LEVEL || "info",
  };
}

/**
 * Returns a health check response including configuration details.
 *
 * BUG: Exposes ALL config values including secrets like DB_PASSWORD,
 * API_KEY, and JWT_SECRET in the response.
 */
export function getHealthCheck(uptimeSeconds: number): HealthResponse {
  const config = loadConfig();

  // BUG: Dumps every config value without filtering sensitive ones
  return {
    status: "ok",
    uptime: uptimeSeconds,
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
  };
}
