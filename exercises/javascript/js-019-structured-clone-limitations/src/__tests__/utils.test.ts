import { describe, it, expect, vi } from "vitest";
import {
  cloneAppState,
  cloneConfigWithOverrides,
  createSnapshot,
  AppState,
  Config,
} from "../utils";

describe("cloneAppState", () => {
  function makeState(): AppState {
    return {
      user: {
        name: "Alice",
        preferences: new Map([
          ["theme", "dark"],
          ["lang", "en"],
        ]),
        createdAt: new Date("2024-01-15"),
        pattern: /^[a-z]+$/i,
      },
      handlers: {
        onUpdate: vi.fn(),
        onError: vi.fn(),
      },
      tags: new Set(["admin", "active"]),
      metadata: { version: 1, nested: { deep: true } },
    };
  }

  it("should not throw when cloning state with functions", () => {
    const state = makeState();
    expect(() => cloneAppState(state)).not.toThrow();
  });

  it("should deep-clone data properties", () => {
    const state = makeState();
    const cloned = cloneAppState(state);

    // Modifying the clone should not affect the original
    cloned.user.name = "Bob";
    cloned.metadata.version = 2;
    (cloned.metadata.nested as Record<string, unknown>).deep = false;

    expect(state.user.name).toBe("Alice");
    expect(state.metadata.version).toBe(1);
    expect((state.metadata.nested as Record<string, unknown>).deep).toBe(true);
  });

  it("should preserve Map instances", () => {
    const state = makeState();
    const cloned = cloneAppState(state);

    expect(cloned.user.preferences).toBeInstanceOf(Map);
    expect(cloned.user.preferences.get("theme")).toBe("dark");

    // Mutating clone's Map should not affect original
    cloned.user.preferences.set("theme", "light");
    expect(state.user.preferences.get("theme")).toBe("dark");
  });

  it("should preserve Set instances", () => {
    const state = makeState();
    const cloned = cloneAppState(state);

    expect(cloned.tags).toBeInstanceOf(Set);
    expect(cloned.tags.has("admin")).toBe(true);

    // Mutating clone's Set should not affect original
    cloned.tags.add("superuser");
    expect(state.tags.has("superuser")).toBe(false);
  });

  it("should preserve Date instances", () => {
    const state = makeState();
    const cloned = cloneAppState(state);

    expect(cloned.user.createdAt).toBeInstanceOf(Date);
    expect(cloned.user.createdAt.getTime()).toBe(
      new Date("2024-01-15").getTime()
    );
  });

  it("should preserve RegExp instances", () => {
    const state = makeState();
    const cloned = cloneAppState(state);

    expect(cloned.user.pattern).toBeInstanceOf(RegExp);
    expect(cloned.user.pattern.source).toBe("^[a-z]+$");
    expect(cloned.user.pattern.flags).toBe("i");
  });

  it("should share function references (not clone them)", () => {
    const state = makeState();
    const cloned = cloneAppState(state);

    // Functions should be the same references -- you can't deep-clone functions
    expect(cloned.handlers.onUpdate).toBe(state.handlers.onUpdate);
    expect(cloned.handlers.onError).toBe(state.handlers.onError);
  });
});

describe("cloneConfigWithOverrides", () => {
  function makeConfig(): Config {
    return {
      database: {
        host: "localhost",
        port: 5432,
        options: new Map([
          ["sslmode", "require"],
          ["timeout", "30"],
        ]),
      },
      features: new Set(["featureA", "featureB"]),
      createdAt: new Date("2024-06-01"),
      urlPattern: /^https?:\/\//,
    };
  }

  it("should deep-clone the config", () => {
    const config = makeConfig();
    const cloned = cloneConfigWithOverrides(config, {});

    cloned.database.host = "remote";
    expect(config.database.host).toBe("localhost");
  });

  it("should preserve Map instances in cloned config", () => {
    const config = makeConfig();
    const cloned = cloneConfigWithOverrides(config, {});

    expect(cloned.database.options).toBeInstanceOf(Map);
    expect(cloned.database.options.get("sslmode")).toBe("require");
  });

  it("should preserve Set instances in cloned config", () => {
    const config = makeConfig();
    const cloned = cloneConfigWithOverrides(config, {});

    expect(cloned.features).toBeInstanceOf(Set);
    expect(cloned.features.has("featureA")).toBe(true);
  });

  it("should preserve Date instances in cloned config", () => {
    const config = makeConfig();
    const cloned = cloneConfigWithOverrides(config, {});

    expect(cloned.createdAt).toBeInstanceOf(Date);
    expect(cloned.createdAt.getTime()).toBe(new Date("2024-06-01").getTime());
  });

  it("should preserve RegExp instances in cloned config", () => {
    const config = makeConfig();
    const cloned = cloneConfigWithOverrides(config, {});

    expect(cloned.urlPattern).toBeInstanceOf(RegExp);
    expect(cloned.urlPattern.source).toBe("^https?:\\/\\/");
  });

  it("should apply overrides", () => {
    const config = makeConfig();
    const cloned = cloneConfigWithOverrides(config, {
      database: {
        host: "production",
        port: 5433,
        options: new Map([["sslmode", "disable"]]),
      },
    });

    expect(cloned.database.host).toBe("production");
    expect(cloned.database.port).toBe(5433);
  });
});

describe("createSnapshot", () => {
  it("should create a true deep copy", () => {
    const obj = {
      name: "test",
      nested: { count: 1, items: [1, 2, 3] },
    };

    const snapshot = createSnapshot(obj);

    // Modify original
    obj.nested.count = 99;
    obj.nested.items.push(4);

    // Snapshot should be unaffected
    expect(snapshot.nested.count).toBe(1);
    expect(snapshot.nested.items).toEqual([1, 2, 3]);
  });

  it("should handle nested objects deeply", () => {
    const obj = {
      a: { b: { c: { d: "deep" } } },
    };

    const snapshot = createSnapshot(obj);
    obj.a.b.c.d = "modified";

    expect(snapshot.a.b.c.d).toBe("deep");
  });

  it("should handle arrays within objects", () => {
    const obj = {
      items: [{ id: 1 }, { id: 2 }],
    };

    const snapshot = createSnapshot(obj);
    obj.items[0].id = 999;
    obj.items.push({ id: 3 });

    expect(snapshot.items[0].id).toBe(1);
    expect(snapshot.items).toHaveLength(2);
  });
});
