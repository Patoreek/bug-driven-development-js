import { deepMerge, mergeConfig, processRequestBody } from "../merge";

describe("merge — Prototype Pollution Prevention", () => {
  // Clean up Object.prototype after each test in case pollution occurs
  afterEach(() => {
    // Remove any properties that got polluted onto Object.prototype
    const pollutedKeys = ["isAdmin", "polluted", "role", "elevated"];
    for (const key of pollutedKeys) {
      if (key in Object.prototype) {
        delete (Object.prototype as Record<string, unknown>)[key];
      }
    }
  });

  describe("deepMerge — basic functionality", () => {
    it("merges flat objects", () => {
      const result = deepMerge({ a: 1 }, { b: 2 });
      expect(result).toEqual({ a: 1, b: 2 });
    });

    it("overwrites existing keys", () => {
      const result = deepMerge({ a: 1 }, { a: 2 });
      expect(result).toEqual({ a: 2 });
    });

    it("deep merges nested objects", () => {
      const result = deepMerge(
        { settings: { theme: "light", lang: "en" } },
        { settings: { theme: "dark" } }
      );
      expect(result).toEqual({
        settings: { theme: "dark", lang: "en" },
      });
    });

    it("does not mutate the target", () => {
      const target = { a: 1 };
      deepMerge(target, { b: 2 });
      expect(target).toEqual({ a: 1 });
    });
  });

  describe("deepMerge — prototype pollution protection", () => {
    it("rejects __proto__ key (does not pollute Object.prototype)", () => {
      const malicious = JSON.parse('{"__proto__":{"isAdmin":true}}');
      deepMerge({}, malicious);

      // Object.prototype must NOT have isAdmin
      const plainObj: Record<string, unknown> = {};
      expect(plainObj.isAdmin).toBeUndefined();
      expect(("isAdmin" in Object.prototype)).toBe(false);
    });

    it("rejects nested __proto__ key", () => {
      const malicious = JSON.parse(
        '{"user":{"__proto__":{"polluted":true}}}'
      );
      deepMerge({ user: {} }, malicious);

      const plainObj: Record<string, unknown> = {};
      expect(plainObj.polluted).toBeUndefined();
    });

    it("rejects constructor.prototype pollution", () => {
      const malicious = JSON.parse(
        '{"constructor":{"prototype":{"elevated":true}}}'
      );
      deepMerge({}, malicious);

      const plainObj: Record<string, unknown> = {};
      expect(plainObj.elevated).toBeUndefined();
    });

    it("still merges legitimate keys alongside malicious ones", () => {
      const malicious = JSON.parse(
        '{"name":"Alice","__proto__":{"isAdmin":true}}'
      );
      const result = deepMerge({ name: "default" }, malicious);

      // Legitimate key should be merged
      expect(result.name).toBe("Alice");

      // Pollution should NOT have occurred
      const plainObj: Record<string, unknown> = {};
      expect(plainObj.isAdmin).toBeUndefined();
    });
  });

  describe("processRequestBody — integration", () => {
    it("merges user settings with defaults", () => {
      const result = processRequestBody({ theme: "dark" });
      expect(result).toEqual({
        theme: "dark",
        notifications: { email: true, sms: false },
        role: "user",
      });
    });

    it("rejects non-object body", () => {
      expect(() => processRequestBody("string")).toThrow(
        "Request body must be a JSON object"
      );
    });

    it("prevents privilege escalation via prototype pollution", () => {
      const maliciousBody = JSON.parse(
        '{"__proto__":{"role":"admin"}}'
      );
      processRequestBody(maliciousBody);

      // A new object should NOT inherit "admin" role
      const newObj: Record<string, unknown> = {};
      expect(newObj.role).toBeUndefined();
    });

    it("prevents isAdmin injection via prototype pollution", () => {
      const maliciousBody = JSON.parse(
        '{"__proto__":{"isAdmin":true}}'
      );
      processRequestBody(maliciousBody);

      // Check if any object now has isAdmin
      const checkObj: Record<string, unknown> = {};
      expect(checkObj.isAdmin).toBeUndefined();
      expect(("isAdmin" in Object.prototype)).toBe(false);
    });
  });
});
