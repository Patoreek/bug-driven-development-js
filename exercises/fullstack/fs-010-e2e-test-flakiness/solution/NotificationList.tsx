"use client";

import { useState, useEffect } from "react";

type Notification = {
  id: string;
  message: string;
  read: boolean;
};

// Simulated API with variable latency
async function fetchNotifications(): Promise<Notification[]> {
  const delay = 50 + Math.random() * 100; // 50-150ms
  await new Promise((resolve) => setTimeout(resolve, delay));
  return [
    { id: "n1", message: "New comment on your post", read: false },
    { id: "n2", message: "Your report is ready", read: false },
    { id: "n3", message: "Welcome to the platform!", read: true },
  ];
}

async function markAsRead(id: string): Promise<void> {
  const delay = 30 + Math.random() * 70; // 30-100ms
  await new Promise((resolve) => setTimeout(resolve, delay));
}

export function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications()
      .then((data) => {
        setNotifications(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      setError("Failed to mark as read");
    }
  };

  const handleDismiss = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (loading) {
    return <div data-testid="loading-spinner">Loading notifications...</div>;
  }

  if (error) {
    return <div data-testid="error-message">{error}</div>;
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div data-testid="notification-list">
      <h2>
        Notifications{" "}
        {unreadCount > 0 && (
          <span data-testid="unread-badge">({unreadCount})</span>
        )}
      </h2>
      {notifications.length === 0 ? (
        <p data-testid="empty-state">No notifications</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li
              key={notification.id}
              data-testid={`notification-${notification.id}`}
              data-read={notification.read}
            >
              <span>{notification.message}</span>
              {!notification.read && (
                <button
                  data-testid={`mark-read-${notification.id}`}
                  onClick={() => handleMarkRead(notification.id)}
                >
                  Mark as read
                </button>
              )}
              <button
                data-testid={`dismiss-${notification.id}`}
                onClick={() => handleDismiss(notification.id)}
              >
                Dismiss
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
