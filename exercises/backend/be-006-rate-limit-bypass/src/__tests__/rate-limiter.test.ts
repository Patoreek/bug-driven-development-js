import { describe, it, expect, beforeEach } from "vitest";
import { RateLimiter, type RequestInfo } from "../rate-limiter";

describe("RateLimiter", () => {
  let limiter: RateLimiter;

  beforeEach(() => {
    limiter = new RateLimiter({
      maxRequests: 3,
      windowMs: 60_000,
      trustedProxies: ["10.0.0.1", "10.0.0.2"],
    });
  });

  describe("getClientIp", () => {
    it("should use remoteAddress when no X-Forwarded-For is present", () => {
      const req: RequestInfo = {
        remoteAddress: "192.168.1.100",
        headers: {},
      };

      expect(limiter.getClientIp(req)).toBe("192.168.1.100");
    });

    it("should ignore X-Forwarded-For when request is NOT from a trusted proxy", () => {
      const req: RequestInfo = {
        remoteAddress: "203.0.113.50",
        headers: { "x-forwarded-for": "1.2.3.4" },
      };

      // Should use remoteAddress since 203.0.113.50 is not a trusted proxy
      expect(limiter.getClientIp(req)).toBe("203.0.113.50");
    });

    it("should trust X-Forwarded-For when request IS from a trusted proxy", () => {
      const req: RequestInfo = {
        remoteAddress: "10.0.0.1",
        headers: { "x-forwarded-for": "1.2.3.4" },
      };

      // Should use forwarded IP since 10.0.0.1 is a trusted proxy
      expect(limiter.getClientIp(req)).toBe("1.2.3.4");
    });

    it("should use the first IP in X-Forwarded-For chain from trusted proxy", () => {
      const req: RequestInfo = {
        remoteAddress: "10.0.0.2",
        headers: { "x-forwarded-for": "5.6.7.8, 10.0.0.3, 10.0.0.1" },
      };

      expect(limiter.getClientIp(req)).toBe("5.6.7.8");
    });

    it("should handle whitespace in X-Forwarded-For", () => {
      const req: RequestInfo = {
        remoteAddress: "10.0.0.1",
        headers: { "x-forwarded-for": "  9.8.7.6  ,  10.0.0.3  " },
      };

      expect(limiter.getClientIp(req)).toBe("9.8.7.6");
    });
  });

  describe("rate limiting with spoofing attempts", () => {
    it("should block after max requests even with spoofed X-Forwarded-For", () => {
      // Attacker sends requests from untrusted IP with spoofed headers
      for (let i = 0; i < 3; i++) {
        const result = limiter.check({
          remoteAddress: "203.0.113.50",
          headers: { "x-forwarded-for": `fake-${i}.0.0.1` },
        });
        expect(result.allowed).toBe(true);
      }

      // 4th request should be blocked — all came from same remoteAddress
      const blocked = limiter.check({
        remoteAddress: "203.0.113.50",
        headers: { "x-forwarded-for": "fake-99.0.0.1" },
      });
      expect(blocked.allowed).toBe(false);
    });

    it("should track the correct IP (remoteAddress) for untrusted requests", () => {
      const result = limiter.check({
        remoteAddress: "203.0.113.50",
        headers: { "x-forwarded-for": "spoofed-ip" },
      });

      expect(result.clientIp).toBe("203.0.113.50");
    });
  });

  describe("rate limiting via trusted proxy", () => {
    it("should use X-Forwarded-For IP when from trusted proxy", () => {
      const result = limiter.check({
        remoteAddress: "10.0.0.1",
        headers: { "x-forwarded-for": "real-client-1.2.3.4" },
      });

      expect(result.clientIp).toBe("real-client-1.2.3.4");
      expect(result.allowed).toBe(true);
    });

    it("should rate limit based on forwarded IP from trusted proxy", () => {
      for (let i = 0; i < 3; i++) {
        limiter.check({
          remoteAddress: "10.0.0.1",
          headers: { "x-forwarded-for": "192.168.5.5" },
        });
      }

      const blocked = limiter.check({
        remoteAddress: "10.0.0.1",
        headers: { "x-forwarded-for": "192.168.5.5" },
      });

      expect(blocked.allowed).toBe(false);
      expect(blocked.clientIp).toBe("192.168.5.5");
    });
  });

  describe("basic rate limiting", () => {
    it("should allow requests within the limit", () => {
      const req: RequestInfo = {
        remoteAddress: "1.1.1.1",
        headers: {},
      };

      const result = limiter.check(req);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(2);
    });

    it("should decrement remaining count", () => {
      const req: RequestInfo = {
        remoteAddress: "2.2.2.2",
        headers: {},
      };

      expect(limiter.check(req).remaining).toBe(2);
      expect(limiter.check(req).remaining).toBe(1);
      expect(limiter.check(req).remaining).toBe(0);
    });

    it("should block after exceeding max requests", () => {
      const req: RequestInfo = {
        remoteAddress: "3.3.3.3",
        headers: {},
      };

      limiter.check(req);
      limiter.check(req);
      limiter.check(req);

      const result = limiter.check(req);
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });
  });
});
