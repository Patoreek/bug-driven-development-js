import { sendNotification, getNotifications, markAsRead } from "../NotificationService";

// BUG: fetch is mocked once here at module scope and never restored.
// The first test's mock leaks into all subsequent tests.
// Tests pass individually but fail when run together because they
// all see the stale mock from the first setup.

globalThis.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ id: "notif-123" }),
});

describe("NotificationService", () => {
  it("should send a notification successfully", async () => {
    const result = await sendNotification({
      message: "Hello!",
      type: "info",
      recipient: "user@example.com",
    });

    expect(result.success).toBe(true);
    expect(result.notificationId).toBe("notif-123");
  });

  it("should handle send failure", async () => {
    // BUG: This tries to mock fetch for a failure case, but the module-level
    // mock is still active. This re-assignment doesn't properly chain with vi.fn()
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Rate limit exceeded" }),
    });

    const result = await sendNotification({
      message: "Urgent!",
      type: "error",
      recipient: "admin@example.com",
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe("Rate limit exceeded");
  });

  it("should fetch notifications for a recipient", async () => {
    // BUG: Still using whatever mock state is left over from previous tests
    const notifications = await getNotifications("user@example.com");
    expect(notifications).toBeDefined();
  });

  it("should mark a notification as read", async () => {
    // BUG: Mock from previous tests may not return the expected shape
    const result = await markAsRead("notif-456");
    expect(result).toBe(true);
  });

  it("should handle network errors", async () => {
    // BUG: Even though we mock a rejection, prior mock state is unpredictable
    globalThis.fetch = vi.fn().mockRejectedValueOnce(new Error("Network error"));

    await expect(getNotifications("user@example.com")).rejects.toThrow("Network error");
  });
});
