import { describe, it, expect } from "vitest";
import { signJwt, verifyJwt, base64urlEncode } from "../jwt";

describe("JWT Verification", () => {
  describe("valid tokens", () => {
    it("should accept a properly signed token with valid claims", () => {
      const token = signJwt({
        sub: "user-1",
        name: "Alice",
        role: "admin",
        iss: "auth.example.com",
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
      });

      const result = verifyJwt(token);
      expect(result.valid).toBe(true);
      expect(result.payload?.sub).toBe("user-1");
      expect(result.payload?.role).toBe("admin");
    });
  });

  describe("algorithm none attack", () => {
    it("should reject tokens with alg: none", () => {
      // Craft a token with "none" algorithm (no signature)
      const header = base64urlEncode(JSON.stringify({ alg: "none", typ: "JWT" }));
      const payload = base64urlEncode(
        JSON.stringify({
          sub: "attacker",
          name: "Evil",
          role: "admin",
          iss: "auth.example.com",
          exp: Math.floor(Date.now() / 1000) + 3600,
        })
      );
      const fakeToken = `${header}.${payload}.`;

      const result = verifyJwt(fakeToken);
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe("expiration check", () => {
    it("should reject expired tokens", () => {
      const token = signJwt({
        sub: "user-1",
        name: "Alice",
        role: "admin",
        iss: "auth.example.com",
        exp: Math.floor(Date.now() / 1000) - 3600, // expired 1 hour ago
        iat: Math.floor(Date.now() / 1000) - 7200,
      });

      const result = verifyJwt(token);
      expect(result.valid).toBe(false);
      expect(result.error).toMatch(/expir/i);
    });

    it("should accept tokens that have not expired", () => {
      const token = signJwt({
        sub: "user-1",
        name: "Alice",
        role: "admin",
        iss: "auth.example.com",
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
      });

      const result = verifyJwt(token);
      expect(result.valid).toBe(true);
    });
  });

  describe("issuer validation", () => {
    it("should reject tokens with wrong issuer", () => {
      const token = signJwt({
        sub: "user-1",
        name: "Alice",
        role: "admin",
        iss: "evil-issuer.com",
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
      });

      const result = verifyJwt(token);
      expect(result.valid).toBe(false);
      expect(result.error).toMatch(/issuer/i);
    });

    it("should reject tokens with missing issuer", () => {
      const token = signJwt({
        sub: "user-1",
        name: "Alice",
        role: "admin",
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
      });

      const result = verifyJwt(token);
      expect(result.valid).toBe(false);
      expect(result.error).toMatch(/issuer/i);
    });
  });

  describe("signature validation", () => {
    it("should reject tokens with tampered payload", () => {
      const token = signJwt({
        sub: "user-1",
        name: "Alice",
        role: "viewer",
        iss: "auth.example.com",
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
      });

      // Tamper with the payload to elevate role
      const parts = token.split(".");
      const tamperedPayload = base64urlEncode(
        JSON.stringify({
          sub: "user-1",
          name: "Alice",
          role: "admin",
          iss: "auth.example.com",
          exp: Math.floor(Date.now() / 1000) + 3600,
          iat: Math.floor(Date.now() / 1000),
        })
      );
      const tamperedToken = `${parts[0]}.${tamperedPayload}.${parts[2]}`;

      const result = verifyJwt(tamperedToken);
      expect(result.valid).toBe(false);
    });

    it("should reject tokens with invalid format", () => {
      const result = verifyJwt("not-a-jwt");
      expect(result.valid).toBe(false);
    });
  });
});
