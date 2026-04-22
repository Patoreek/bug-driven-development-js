import {
  createSession,
  getSession,
  login,
  logout,
  getSessionCookie,
  clearSessions,
} from "../session";

describe("Session Fixation Prevention", () => {
  beforeEach(() => {
    clearSessions();
  });

  describe("session creation", () => {
    it("creates a session with null userId", () => {
      const session = createSession();
      expect(session.id).toBeDefined();
      expect(session.userId).toBeNull();
    });

    it("creates sessions with unique IDs", () => {
      const s1 = createSession();
      const s2 = createSession();
      expect(s1.id).not.toBe(s2.id);
    });

    it("stores session in session store", () => {
      const session = createSession();
      const retrieved = getSession(session.id);
      expect(retrieved).toEqual(session);
    });
  });

  describe("login - session regeneration", () => {
    it("returns a NEW session ID after successful login", () => {
      const preLoginSession = createSession();
      const oldId = preLoginSession.id;

      const result = login(oldId, "user123", "password");

      expect(result.success).toBe(true);
      expect(result.sessionId).not.toBe(oldId);
    });

    it("new session contains the authenticated userId", () => {
      const preLoginSession = createSession();
      const result = login(preLoginSession.id, "user123", "password");

      const newSession = getSession(result.sessionId);
      expect(newSession).not.toBeNull();
      expect(newSession!.userId).toBe("user123");
    });

    it("old session ID is invalidated after login", () => {
      const preLoginSession = createSession();
      const oldId = preLoginSession.id;

      login(oldId, "user123", "password");

      const oldSession = getSession(oldId);
      expect(oldSession).toBeNull();
    });

    it("preserves session data during regeneration", () => {
      const preLoginSession = createSession();
      // Simulate storing data before login
      const session = getSession(preLoginSession.id)!;
      session.data = { cart: ["item1", "item2"], theme: "dark" };

      const result = login(preLoginSession.id, "user123", "password");
      const newSession = getSession(result.sessionId);

      expect(newSession!.data).toEqual({
        cart: ["item1", "item2"],
        theme: "dark",
      });
    });

    it("fails login for non-existent session", () => {
      const result = login("fake-session-id", "user123", "password");
      expect(result.success).toBe(false);
    });

    it("attacker cannot use pre-login session ID to access authenticated session", () => {
      // Attacker creates/knows a session ID
      const attackerSession = createSession();
      const attackerKnownId = attackerSession.id;

      // Victim logs in with that session ID
      const loginResult = login(attackerKnownId, "victim", "password");
      expect(loginResult.success).toBe(true);

      // Attacker tries to use the old session ID
      const attackerAccess = getSession(attackerKnownId);
      expect(attackerAccess).toBeNull();

      // But victim's new session works
      const victimSession = getSession(loginResult.sessionId);
      expect(victimSession).not.toBeNull();
      expect(victimSession!.userId).toBe("victim");
    });
  });

  describe("logout", () => {
    it("destroys the session", () => {
      const session = createSession();
      const result = login(session.id, "user123", "password");
      logout(result.sessionId);
      expect(getSession(result.sessionId)).toBeNull();
    });
  });

  describe("secure cookie attributes", () => {
    it("sets httpOnly to true", () => {
      const cookie = getSessionCookie("test-id");
      expect(cookie.httpOnly).toBe(true);
    });

    it("sets secure to true", () => {
      const cookie = getSessionCookie("test-id");
      expect(cookie.secure).toBe(true);
    });

    it("sets sameSite to Strict or Lax", () => {
      const cookie = getSessionCookie("test-id");
      expect(["Strict", "Lax"]).toContain(cookie.sameSite);
    });

    it("sets the correct session ID value", () => {
      const cookie = getSessionCookie("my-session-123");
      expect(cookie.value).toBe("my-session-123");
    });

    it("sets a reasonable maxAge", () => {
      const cookie = getSessionCookie("test-id");
      expect(cookie.maxAge).toBeGreaterThan(0);
    });

    it("sets path to /", () => {
      const cookie = getSessionCookie("test-id");
      expect(cookie.path).toBe("/");
    });
  });
});
