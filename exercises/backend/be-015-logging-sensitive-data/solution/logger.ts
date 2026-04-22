export interface UserEvent {
  type: string;
  userId: string;
  email: string;
  password?: string;
  creditCard?: string;
  ssn?: string;
  metadata?: Record<string, unknown>;
}

export interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  data: Record<string, unknown>;
}

const logBuffer: LogEntry[] = [];

const REDACTED = "[REDACTED]";

/**
 * Logs a user event with sensitive fields redacted.
 */
export function logUserEvent(event: UserEvent): LogEntry {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level: "info",
    message: `User event: ${event.type}`,
    data: {
      userId: event.userId,
      email: event.email,
      // Redact sensitive fields instead of logging raw values
      password: event.password ? REDACTED : undefined,
      creditCard: event.creditCard ? REDACTED : undefined,
      ssn: event.ssn ? REDACTED : undefined,
      ...event.metadata,
    },
  };

  logBuffer.push(entry);
  return entry;
}

export function getLogEntries(): LogEntry[] {
  return [...logBuffer];
}

export function clearLogs(): void {
  logBuffer.length = 0;
}
