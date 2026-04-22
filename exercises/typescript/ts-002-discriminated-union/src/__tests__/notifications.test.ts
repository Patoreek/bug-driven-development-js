import { describe, it, expect } from "vitest";
import { formatNotification, createNotification, countByType } from "../notifications";

describe("formatNotification", () => {
  it("formats an info notification", () => {
    const result = formatNotification(
      createNotification("info", "Update", { message: "System updated successfully" })
    );
    expect(result).toContain("Update");
    expect(result).toContain("System updated successfully");
  });

  it("formats an error notification with error code", () => {
    const result = formatNotification(
      createNotification("error", "Failed", { message: "Connection lost", errorCode: 503 })
    );
    expect(result).toContain("Failed");
    expect(result).toContain("503");
    expect(result).toContain("Connection lost");
  });

  it("formats a progress notification with percentage", () => {
    const result = formatNotification(
      createNotification("progress", "Upload", { progress: 75, total: 100 })
    );
    expect(result).toContain("Upload");
    expect(result).toContain("75%");
  });

  it("formats a link notification", () => {
    const result = formatNotification(
      createNotification("link", "Docs", { href: "https://example.com" })
    );
    expect(result).toContain("Docs");
    expect(result).toContain("https://example.com");
  });

  it("should throw for an unknown notification type", () => {
    // The buggy code silently returns the title for unknown types.
    // The solution should throw because exhaustive checking catches it.
    const unknown = { type: "unknown-type", title: "Mystery" } as any;
    expect(() => formatNotification(unknown)).toThrow();
  });
});

describe("createNotification - type safety", () => {
  it("should create an info notification with required message field", () => {
    const n = createNotification("info", "Test", { message: "Hello" });
    expect(n.type).toBe("info");
    expect(n).toHaveProperty("message", "Hello");
  });

  it("should create an error notification with required errorCode and message", () => {
    const n = createNotification("error", "Err", { message: "Oops", errorCode: 500 });
    expect(n.type).toBe("error");
    expect(n).toHaveProperty("errorCode", 500);
  });

  it("should create a progress notification with required progress and total", () => {
    const n = createNotification("progress", "Upload", { progress: 50, total: 200 });
    expect(n.type).toBe("progress");
    expect(n).toHaveProperty("progress", 50);
    expect(n).toHaveProperty("total", 200);
  });

  it("should create a link notification with required href", () => {
    const n = createNotification("link", "Link", { href: "https://example.com" });
    expect(n.type).toBe("link");
    expect(n).toHaveProperty("href", "https://example.com");
  });
});

describe("countByType", () => {
  it("counts notifications by type", () => {
    const notifications = [
      createNotification("info", "A", { message: "a" }),
      createNotification("info", "B", { message: "b" }),
      createNotification("error", "C", { message: "c", errorCode: 400 }),
      createNotification("progress", "D", { progress: 1, total: 10 }),
    ];

    const counts = countByType(notifications);
    expect(counts.info).toBe(2);
    expect(counts.error).toBe(1);
    expect(counts.progress).toBe(1);
  });

  it("returns correct type for counts — keys should be notification type literals", () => {
    const notifications = [
      createNotification("info", "A", { message: "msg" }),
      createNotification("link", "B", { href: "https://example.com" }),
    ];

    const counts = countByType(notifications);

    const keys = Object.keys(counts);
    const validTypes = ["info", "error", "progress", "link"];
    for (const key of keys) {
      expect(validTypes).toContain(key);
    }
  });
});

describe("exhaustive type checking", () => {
  it("formatNotification should handle all known types without a generic fallback", () => {
    const types = ["info", "error", "progress", "link"] as const;
    const samples = {
      info: createNotification("info", "I", { message: "msg" }),
      error: createNotification("error", "E", { message: "msg", errorCode: 0 }),
      progress: createNotification("progress", "P", { progress: 0, total: 1 }),
      link: createNotification("link", "L", { href: "https://x.com" }),
    };

    for (const type of types) {
      const result = formatNotification(samples[type]);
      expect(result.length).toBeGreaterThan(samples[type].title.length);
    }
  });
});
