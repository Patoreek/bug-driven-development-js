import {
  isValidEmail,
  isValidUrl,
  isSafeJsonString,
  isValidSlug,
  validateWithTimeout,
  validateRegistration,
} from "../validator";

describe("Regex DoS — Validator", () => {
  describe("isValidEmail", () => {
    it("accepts valid email addresses", () => {
      expect(isValidEmail("user@example.com")).toBe(true);
      expect(isValidEmail("first.last@company.co.uk")).toBe(true);
      expect(isValidEmail("user+tag@gmail.com")).toBe(true);
    });

    it("rejects invalid email addresses", () => {
      expect(isValidEmail("not-an-email")).toBe(false);
      expect(isValidEmail("@example.com")).toBe(false);
      expect(isValidEmail("user@")).toBe(false);
      expect(isValidEmail("")).toBe(false);
    });

    it("does not hang on crafted ReDoS input", () => {
      // This input causes catastrophic backtracking with vulnerable regex.
      // A long string of characters that match the first part of the pattern
      // but fail to match the overall pattern.
      const malicious = "a".repeat(30) + "@";
      const { timedOut } = validateWithTimeout(isValidEmail, malicious, 50);
      expect(timedOut).toBe(false);
    });

    it("does not hang on a longer crafted input", () => {
      const malicious = "a.".repeat(20) + "!";
      const { timedOut } = validateWithTimeout(isValidEmail, malicious, 50);
      expect(timedOut).toBe(false);
    });
  });

  describe("isValidUrl", () => {
    it("accepts valid URLs", () => {
      expect(isValidUrl("https://example.com")).toBe(true);
      expect(isValidUrl("http://sub.domain.co.uk/path")).toBe(true);
      expect(isValidUrl("example.com")).toBe(true);
    });

    it("rejects invalid URLs", () => {
      expect(isValidUrl("")).toBe(false);
      expect(isValidUrl("not a url")).toBe(false);
    });

    it("does not hang on crafted ReDoS input", () => {
      const malicious = "https://" + "a.".repeat(30) + "!";
      const { timedOut } = validateWithTimeout(isValidUrl, malicious, 50);
      expect(timedOut).toBe(false);
    });
  });

  describe("isSafeJsonString", () => {
    it("accepts safe strings", () => {
      expect(isSafeJsonString("hello world")).toBe(true);
      expect(isSafeJsonString("test-value_123")).toBe(true);
      expect(isSafeJsonString("")).toBe(true);
    });

    it("rejects unsafe strings", () => {
      expect(isSafeJsonString("<script>alert('xss')</script>")).toBe(false);
      expect(isSafeJsonString('{"key": "value"}')).toBe(false);
    });

    it("does not hang on crafted ReDoS input", () => {
      // Long string of characters that match both alternation branches
      const malicious = "a ".repeat(25) + "!";
      const { timedOut } = validateWithTimeout(isSafeJsonString, malicious, 50);
      expect(timedOut).toBe(false);
    });
  });

  describe("isValidSlug", () => {
    it("accepts valid slugs", () => {
      expect(isValidSlug("hello-world")).toBe(true);
      expect(isValidSlug("my-post-123")).toBe(true);
      expect(isValidSlug("simple")).toBe(true);
    });

    it("rejects invalid slugs", () => {
      expect(isValidSlug("UPPERCASE")).toBe(false);
      expect(isValidSlug("has spaces")).toBe(false);
      expect(isValidSlug("special@chars")).toBe(false);
      expect(isValidSlug("")).toBe(false);
    });

    it("does not hang on crafted ReDoS input", () => {
      // Classic ReDoS payload for ([a-z0-9-]+)+ pattern
      const malicious = "a-".repeat(25) + "!";
      const { timedOut } = validateWithTimeout(isValidSlug, malicious, 50);
      expect(timedOut).toBe(false);
    });
  });

  describe("validateRegistration", () => {
    it("validates a correct registration", () => {
      const result = validateRegistration({
        email: "user@example.com",
        website: "https://example.com",
        username: "my-username",
      });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("returns errors for invalid fields", () => {
      const result = validateRegistration({
        email: "not-an-email",
        website: "not a url",
        username: "INVALID USERNAME",
      });
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(2);
    });

    it("does not hang on malicious registration data", () => {
      const start = Date.now();
      validateRegistration({
        email: "a".repeat(30) + "@",
        website: "https://" + "a.".repeat(30) + "!",
        username: "a-".repeat(25) + "!",
      });
      const elapsed = Date.now() - start;

      // All three validators combined should complete in under 100ms
      expect(elapsed).toBeLessThan(100);
    });
  });
});
