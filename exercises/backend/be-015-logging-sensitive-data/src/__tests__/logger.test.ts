import { describe, it, expect, beforeEach } from "vitest";
import { logUserEvent, getLogEntries, clearLogs } from "../logger";

describe("Logging Sensitive Data", () => {
  beforeEach(() => {
    clearLogs();
  });

  describe("basic logging", () => {
    it("should log user events with safe fields", () => {
      const entry = logUserEvent({
        type: "login",
        userId: "user-123",
        email: "alice@example.com",
      });

      expect(entry.level).toBe("info");
      expect(entry.message).toContain("login");
      expect(entry.data.userId).toBe("user-123");
    });

    it("should include a timestamp", () => {
      const entry = logUserEvent({
        type: "signup",
        userId: "user-456",
        email: "bob@example.com",
      });

      expect(entry.timestamp).toBeDefined();
    });

    it("should store entries in the log buffer", () => {
      logUserEvent({
        type: "login",
        userId: "user-1",
        email: "a@example.com",
      });
      logUserEvent({
        type: "logout",
        userId: "user-2",
        email: "b@example.com",
      });

      expect(getLogEntries()).toHaveLength(2);
    });
  });

  describe("sensitive data redaction", () => {
    it("should NOT include raw password in log data", () => {
      const entry = logUserEvent({
        type: "signup",
        userId: "user-1",
        email: "alice@example.com",
        password: "SuperSecret123!",
      });

      const allValues = JSON.stringify(entry.data);
      expect(allValues).not.toContain("SuperSecret123!");
      expect(entry.data.password).not.toBe("SuperSecret123!");
    });

    it("should NOT include raw credit card number in log data", () => {
      const entry = logUserEvent({
        type: "purchase",
        userId: "user-1",
        email: "alice@example.com",
        creditCard: "4111-1111-1111-1111",
      });

      const allValues = JSON.stringify(entry.data);
      expect(allValues).not.toContain("4111-1111-1111-1111");
      expect(entry.data.creditCard).not.toBe("4111-1111-1111-1111");
    });

    it("should NOT include raw SSN in log data", () => {
      const entry = logUserEvent({
        type: "identity-verify",
        userId: "user-1",
        email: "alice@example.com",
        ssn: "123-45-6789",
      });

      const allValues = JSON.stringify(entry.data);
      expect(allValues).not.toContain("123-45-6789");
      expect(entry.data.ssn).not.toBe("123-45-6789");
    });

    it("should redact password to a placeholder like '[REDACTED]'", () => {
      const entry = logUserEvent({
        type: "signup",
        userId: "user-1",
        email: "alice@example.com",
        password: "MyPassword!",
      });

      // Should be redacted, not absent
      expect(entry.data.password).toMatch(/\[REDACTED\]/i);
    });

    it("should redact credit card to a placeholder or masked value", () => {
      const entry = logUserEvent({
        type: "purchase",
        userId: "user-1",
        email: "alice@example.com",
        creditCard: "4111-1111-1111-1111",
      });

      expect(entry.data.creditCard).toMatch(/\[REDACTED\]/i);
    });

    it("should redact SSN to a placeholder or masked value", () => {
      const entry = logUserEvent({
        type: "identity-verify",
        userId: "user-1",
        email: "alice@example.com",
        ssn: "123-45-6789",
      });

      expect(entry.data.ssn).toMatch(/\[REDACTED\]/i);
    });
  });

  describe("non-sensitive data preserved", () => {
    it("should keep userId and email intact", () => {
      const entry = logUserEvent({
        type: "login",
        userId: "user-99",
        email: "test@example.com",
      });

      expect(entry.data.userId).toBe("user-99");
      expect(entry.data.email).toBe("test@example.com");
    });

    it("should pass through metadata unchanged", () => {
      const entry = logUserEvent({
        type: "page-view",
        userId: "user-1",
        email: "a@example.com",
        metadata: { page: "/dashboard", referrer: "google.com" },
      });

      expect(entry.data.page).toBe("/dashboard");
      expect(entry.data.referrer).toBe("google.com");
    });
  });
});
