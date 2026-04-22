import { describe, it, expect } from "vitest";
import { getHealthCheck, loadConfig } from "../config";

describe("Config and Health Check", () => {
  describe("loadConfig", () => {
    it("should return all config values", () => {
      const config = loadConfig();
      expect(config.port).toBe(3000);
      expect(config.nodeEnv).toBe("production");
      expect(config.dbHost).toBeDefined();
    });
  });

  describe("getHealthCheck", () => {
    it("should include status and uptime", () => {
      const health = getHealthCheck(120);
      expect(health.status).toBe("ok");
      expect(health.uptime).toBe(120);
    });

    it("should include safe config values", () => {
      const health = getHealthCheck(60);
      expect(health.config.port).toBe(3000);
      expect(health.config.nodeEnv).toBe("production");
      expect(health.config.logLevel).toBe("info");
    });

    it("should NOT expose database password", () => {
      const health = getHealthCheck(60);
      expect(health.config.dbPassword).toBeUndefined();
      const values = Object.values(health.config).map(String);
      expect(values.some((v) => v.includes("s3cret"))).toBe(false);
    });

    it("should NOT expose API key", () => {
      const health = getHealthCheck(60);
      expect(health.config.apiKey).toBeUndefined();
      const values = Object.values(health.config).map(String);
      expect(values.some((v) => v.includes("sk_live"))).toBe(false);
    });

    it("should NOT expose JWT secret", () => {
      const health = getHealthCheck(60);
      expect(health.config.jwtSecret).toBeUndefined();
      const values = Object.values(health.config).map(String);
      expect(values.some((v) => v.includes("jwt-signing"))).toBe(false);
    });

    it("should NOT expose Redis URL (may contain credentials)", () => {
      const health = getHealthCheck(60);
      expect(health.config.redisUrl).toBeUndefined();
    });

    it("should not contain any key with 'secret', 'password', 'key', or 'token' in its name", () => {
      const health = getHealthCheck(60);
      const sensitivePattern = /secret|password|key|token/i;
      for (const key of Object.keys(health.config)) {
        expect(key).not.toMatch(sensitivePattern);
      }
    });
  });
});
