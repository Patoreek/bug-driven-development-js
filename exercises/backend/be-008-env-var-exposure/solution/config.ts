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

const env: Record<string, string> = {
  PORT: "3000",
  NODE_ENV: "production",
  DB_HOST: "db.internal.example.com",
  DB_PASSWORD: "s3cret-p@ssw0rd!",
  API_KEY: "sk_live_abc123xyz789",
  JWT_SECRET: "my-jwt-signing-secret",
  REDIS_URL: "redis://cache.internal:6379",
  LOG_LEVEL: "info",
};

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
 * Returns a health check response with only safe, non-sensitive config values.
 */
export function getHealthCheck(uptimeSeconds: number): HealthResponse {
  const config = loadConfig();

  // Only expose safe, non-sensitive configuration values
  return {
    status: "ok",
    uptime: uptimeSeconds,
    config: {
      port: config.port,
      nodeEnv: config.nodeEnv,
      logLevel: config.logLevel,
    },
  };
}
