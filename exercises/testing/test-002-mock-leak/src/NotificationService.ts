export interface Notification {
  id: string;
  message: string;
  type: "info" | "warning" | "error";
  recipient: string;
}

export interface NotificationResponse {
  success: boolean;
  notificationId?: string;
  error?: string;
}

const API_BASE = "https://api.example.com";

export async function sendNotification(
  notification: Omit<Notification, "id">
): Promise<NotificationResponse> {
  const response = await fetch(`${API_BASE}/notifications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(notification),
  });

  if (!response.ok) {
    const errorData = await response.json();
    return { success: false, error: errorData.message || "Failed to send notification" };
  }

  const data = await response.json();
  return { success: true, notificationId: data.id };
}

export async function getNotifications(recipient: string): Promise<Notification[]> {
  const response = await fetch(`${API_BASE}/notifications?recipient=${recipient}`);

  if (!response.ok) {
    throw new Error("Failed to fetch notifications");
  }

  const data = await response.json();
  return data.notifications;
}

export async function markAsRead(notificationId: string): Promise<boolean> {
  const response = await fetch(`${API_BASE}/notifications/${notificationId}/read`, {
    method: "PATCH",
  });

  return response.ok;
}
