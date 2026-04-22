// Solution: Uses discriminated unions with exhaustive checking

type Notification =
  | { type: "info"; title: string; message: string }
  | { type: "error"; title: string; message: string; errorCode: number }
  | { type: "progress"; title: string; progress: number; total: number }
  | { type: "link"; title: string; href: string };

function assertNever(value: never): never {
  throw new Error(`Unhandled notification type: ${(value as { type: string }).type}`);
}

export function formatNotification(notification: Notification): string {
  switch (notification.type) {
    case "info":
      return `ℹ️ ${notification.title}: ${notification.message}`;
    case "error":
      return `❌ ${notification.title} (code: ${notification.errorCode}): ${notification.message}`;
    case "progress": {
      const pct = Math.round((notification.progress / notification.total) * 100);
      return `⏳ ${notification.title}: ${pct}%`;
    }
    case "link":
      return `🔗 ${notification.title}: ${notification.href}`;
    default:
      return assertNever(notification);
  }
}

export function createNotification(type: "info", title: string, extra: { message: string }): Notification;
export function createNotification(type: "error", title: string, extra: { message: string; errorCode: number }): Notification;
export function createNotification(type: "progress", title: string, extra: { progress: number; total: number }): Notification;
export function createNotification(type: "link", title: string, extra: { href: string }): Notification;
export function createNotification(type: string, title: string, extra: Record<string, unknown> = {}): Notification {
  return { type, title, ...extra } as Notification;
}

type NotificationType = Notification["type"];

export function countByType(notifications: Notification[]): Partial<Record<NotificationType, number>> {
  const counts: Partial<Record<NotificationType, number>> = {};
  for (const n of notifications) {
    counts[n.type] = (counts[n.type] ?? 0) + 1;
  }
  return counts;
}
