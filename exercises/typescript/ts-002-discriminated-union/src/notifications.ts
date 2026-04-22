// BUG: This module handles different notification types but uses a shared interface
// instead of a discriminated union pattern. The loose typing leads to runtime bugs.

interface Notification {
  type: string;
  title: string;
  message?: string;
  href?: string;
  progress?: number;
  total?: number;
  errorCode?: number;
}

export function formatNotification(notification: Notification): string {
  if (notification.type === "info") {
    return `ℹ️ ${notification.title}: ${notification.message}`;
  }

  if (notification.type === "error") {
    return `❌ ${notification.title} (code: ${notification.errorCode}): ${notification.message}`;
  }

  if (notification.type === "progress") {
    const pct = Math.round(((notification.progress ?? 0) / (notification.total ?? 1)) * 100);
    return `⏳ ${notification.title}: ${pct}%`;
  }

  if (notification.type === "link") {
    return `🔗 ${notification.title}: ${notification.href}`;
  }

  // BUG: Silently returns a default — unknown types should throw
  return `${notification.title}`;
}

// BUG: Accepts any type string and any extra fields without validation.
// Should enforce that each type has exactly its required fields.
export function createNotification(type: string, title: string, extra: Record<string, unknown> = {}): Notification {
  return { type, title, ...extra };
}

// BUG: Accepts any string key in the result, not just valid notification types
export function countByType(notifications: Notification[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const n of notifications) {
    counts[n.type] = (counts[n.type] ?? 0) + 1;
  }
  return counts;
}
