// BUG: This logger writes sensitive user data (passwords, credit cards,
// SSNs) directly to log output without redaction.

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

/**
 * Logs a user event.
 *
 * BUG: Logs the entire event object without redacting sensitive fields.
 */
export function logUserEvent(event: UserEvent): LogEntry {
  // BUG: Sensitive fields (password, creditCard, ssn) are logged as-is
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level: "info",
    message: `User event: ${event.type}`,
    data: {
      userId: event.userId,
      email: event.email,
      password: event.password,
      creditCard: event.creditCard,
      ssn: event.ssn,
      ...event.metadata,
    },
  };

  logBuffer.push(entry);
  return entry;
}

/**
 * Returns all logged entries.
 */
export function getLogEntries(): LogEntry[] {
  return [...logBuffer];
}

/**
 * Clears the log buffer (for testing).
 */
export function clearLogs(): void {
  logBuffer.length = 0;
}
