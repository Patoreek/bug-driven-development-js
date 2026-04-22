export interface Session {
  id: string;
  userId: string | null;
  data: Record<string, unknown>;
  createdAt: number;
}

export interface CookieOptions {
  name: string;
  value: string;
  httpOnly: boolean;
  secure: boolean;
  sameSite: "Strict" | "Lax" | "None";
  path: string;
  maxAge: number;
}

// In-memory session store
const sessions = new Map<string, Session>();

let idCounter = 0;

/**
 * Generates a unique session ID.
 * (Simplified for exercise -- real apps use crypto.randomUUID or similar)
 */
export function generateSessionId(): string {
  idCounter++;
  return `sess_${Date.now()}_${idCounter}`;
}

/**
 * Creates a new session and returns it.
 */
export function createSession(): Session {
  const session: Session = {
    id: generateSessionId(),
    userId: null,
    data: {},
    createdAt: Date.now(),
  };
  sessions.set(session.id, session);
  return session;
}

/**
 * Retrieves a session by ID.
 */
export function getSession(sessionId: string): Session | null {
  return sessions.get(sessionId) ?? null;
}

/**
 * Authenticates a user and associates them with the current session.
 * Returns the session ID to use going forward.
 *
 * BUG: Does not regenerate session ID after authentication,
 * allowing session fixation attacks.
 */
export function login(
  sessionId: string,
  userId: string,
  _password: string
): { sessionId: string; success: boolean } {
  const session = sessions.get(sessionId);
  if (!session) {
    return { sessionId, success: false };
  }

  // Simulate password check (always succeeds for this exercise)
  // BUG: Reuses the same session ID after login — session fixation!
  session.userId = userId;

  return { sessionId: session.id, success: true };
}

/**
 * Logs out a user by destroying their session.
 */
export function logout(sessionId: string): void {
  sessions.delete(sessionId);
}

/**
 * Generates cookie options for a session cookie.
 *
 * BUG: Missing secure cookie attributes.
 */
export function getSessionCookie(sessionId: string): CookieOptions {
  return {
    name: "session_id",
    value: sessionId,
    // BUG: All three security attributes are wrong
    httpOnly: false,
    secure: false,
    sameSite: "None",
    path: "/",
    maxAge: 86400,
  };
}

/**
 * Reset the session store (for testing).
 */
export function clearSessions(): void {
  sessions.clear();
  idCounter = 0;
}
