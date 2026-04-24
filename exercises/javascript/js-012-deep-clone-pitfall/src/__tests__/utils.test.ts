import { describe, it, expect } from "vitest";
import { cloneConfig, updateNestedSetting, mergeConfigs, AppConfig } from "../utils";

function createBaseConfig(): AppConfig {
  return {
    appName: "MyApp",
    version: "1.0.0",
    database: {
      host: "localhost",
      port: 5432,
      credentials: {
        username: "admin",
        password: "secret",
      },
    },
    features: {
      darkMode: false,
      betaFeatures: ["feature-a"],
    },
    logging: {
      level: "info",
      destinations: ["console", "file"],
    },
  };
}

describe("cloneConfig", () => {
  it("should create a separate copy of the config", () => {
    const original = createBaseConfig();
    const clone = cloneConfig(original);

    expect(clone).toEqual(original);
    expect(clone).not.toBe(original);
  });

  it("should not share nested object references", () => {
    const original = createBaseConfig();
    const clone = cloneConfig(original);

    clone.database.port = 3306;
    expect(original.database.port).toBe(5432);
  });

  it("should not share deeply nested object references", () => {
    const original = createBaseConfig();
    const clone = cloneConfig(original);

    clone.database.credentials.username = "hacker";
    expect(original.database.credentials.username).toBe("admin");
  });

  it("should not share array references", () => {
    const original = createBaseConfig();
    const clone = cloneConfig(original);

    clone.features.betaFeatures.push("feature-b");
    expect(original.features.betaFeatures).toEqual(["feature-a"]);
  });

  it("should allow independent modifications", () => {
    const original = createBaseConfig();
    const clone = cloneConfig(original);

    clone.appName = "ClonedApp";
    clone.logging.level = "debug";
    clone.logging.destinations.push("sentry");

    expect(original.appName).toBe("MyApp");
    expect(original.logging.level).toBe("info");
    expect(original.logging.destinations).toEqual(["console", "file"]);
  });
});

describe("updateNestedSetting", () => {
  it("should update a top-level property", () => {
    const config = createBaseConfig();
    const updated = updateNestedSetting(config, "appName", "UpdatedApp");

    expect(updated.appName).toBe("UpdatedApp");
  });

  it("should not mutate the original config", () => {
    const config = createBaseConfig();
    updateNestedSetting(config, "database.port", 3306);

    expect(config.database.port).toBe(5432);
  });

  it("should update a nested property", () => {
    const config = createBaseConfig();
    const updated = updateNestedSetting(config, "database.port", 3306);

    expect(updated.database.port).toBe(3306);
  });

  it("should update a deeply nested property without mutating original", () => {
    const config = createBaseConfig();
    const updated = updateNestedSetting(
      config,
      "database.credentials.username",
      "newadmin"
    );

    expect(updated.database.credentials.username).toBe("newadmin");
    expect(config.database.credentials.username).toBe("admin");
  });

  it("should not affect unrelated nested properties", () => {
    const config = createBaseConfig();
    const updated = updateNestedSetting(config, "logging.level", "debug");

    expect(updated.logging.level).toBe("debug");
    expect(updated.database.host).toBe("localhost");
    expect(config.logging.level).toBe("info");
  });
});

describe("mergeConfigs", () => {
  it("should merge top-level overrides", () => {
    const base = createBaseConfig();
    const merged = mergeConfigs(base, { appName: "ProdApp" });

    expect(merged.appName).toBe("ProdApp");
  });

  it("should not mutate the base config", () => {
    const base = createBaseConfig();
    mergeConfigs(base, { appName: "ProdApp" });

    expect(base.appName).toBe("MyApp");
  });

  it("should preserve base properties not in overrides", () => {
    const base = createBaseConfig();
    const merged = mergeConfigs(base, { appName: "ProdApp" });

    expect(merged.version).toBe("1.0.0");
    expect(merged.database.host).toBe("localhost");
  });

  it("should not mutate base when merging nested objects", () => {
    const base = createBaseConfig();
    mergeConfigs(base, { logging: { level: "error" } } as Partial<Record<string, unknown>>);

    expect(base.logging.level).toBe("info");
  });
});
