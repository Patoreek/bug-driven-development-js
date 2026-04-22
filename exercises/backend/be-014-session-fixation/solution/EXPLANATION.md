# Solution: Session Fixation

## The Bug

Two security issues:

### 1. Session Fixation
The `login` function kept the same session ID after authentication:
```ts
session.userId = userId; // Same session ID, now authenticated!
return { sessionId: session.id, success: true };
```
An attacker who knows or sets a victim's pre-login session ID can wait for the victim to log in and then reuse that same session ID to access the authenticated session.

### 2. Insecure Cookie Attributes
The cookie was missing all three critical security attributes:
```ts
httpOnly: false,  // Accessible via document.cookie (XSS can steal it)
secure: false,    // Sent over HTTP (can be intercepted)
sameSite: "None", // Sent with cross-site requests (CSRF vulnerable)
```

## The Fix

### 1. Regenerate Session on Login
```ts
// Delete old session
sessions.delete(sessionId);

// Create new session with fresh ID, preserving data
const newSession = {
  id: generateSessionId(),
  userId,
  data: existingData,
  createdAt: Date.now(),
};
sessions.set(newSession.id, newSession);
```
The old session ID is invalidated, so even if an attacker knows it, it's useless after login.

### 2. Set Secure Cookie Attributes
```ts
httpOnly: true,    // Not accessible to JavaScript
secure: true,      // Only sent over HTTPS
sameSite: "Lax",   // Not sent with cross-site POST requests
```

## Key Takeaway

Always regenerate the session ID after any privilege level change (login, role change, etc.). This is the primary defense against session fixation. Additionally, always set `HttpOnly`, `Secure`, and `SameSite` on session cookies to defend in depth against XSS and CSRF attacks.
