import { sendNotification, getNotifications, markAsRead } from "../NotificationService";

describe("NotificationService", () => {
  beforeEach(() => {
    // Fresh mock for each test -- no leaking between tests
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should send a notification successfully", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: "notif-123" }),
    } as Response);

    const result = await sendNotification({
      message: "Hello!",
      type: "info",
      recipient: "user@example.com",
    });

    expect(result.success).toBe(true);
    expect(result.notificationId).toBe("notif-123");
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://api.example.com/notifications",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
    );
  });

  it("should handle send failure", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Rate limit exceeded" }),
    } as Response);

    const result = await sendNotification({
      message: "Urgent!",
      type: "error",
      recipient: "admin@example.com",
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe("Rate limit exceeded");
  });

  it("should fetch notifications for a recipient", async () => {
    const mockNotifications = [
      { id: "1", message: "Hello", type: "info", recipient: "user@example.com" },
      { id: "2", message: "Update", type: "warning", recipient: "user@example.com" },
    ];

    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ notifications: mockNotifications }),
    } as Response);

    const notifications = await getNotifications("user@example.com");

    expect(notifications).toEqual(mockNotifications);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://api.example.com/notifications?recipient=user@example.com"
    );
  });

  it("should mark a notification as read", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
    } as Response);

    const result = await markAsRead("notif-456");

    expect(result).toBe(true);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://api.example.com/notifications/notif-456/read",
      expect.objectContaining({ method: "PATCH" })
    );
  });

  it("should handle network errors", async () => {
    vi.mocked(globalThis.fetch).mockRejectedValueOnce(new Error("Network error"));

    await expect(getNotifications("user@example.com")).rejects.toThrow("Network error");
  });
});
