# Hint 3 (Strong)

In the `login` function:
```ts
const existingData = { ...oldSession.data };
sessions.delete(sessionId);  // Invalidate old session

const newSession = {
  id: generateSessionId(),   // Fresh ID
  userId,
  data: existingData,        // Preserve session data
  createdAt: Date.now(),
};
sessions.set(newSession.id, newSession);
return { sessionId: newSession.id, success: true };
```

For `getSessionCookie`, change:
```ts
httpOnly: true,
secure: true,
sameSite: "Lax",
```
