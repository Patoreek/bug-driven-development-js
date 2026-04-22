# Hint 2 (Medium)

The fix for session fixation is to **regenerate the session ID** after successful authentication. This means:
1. Copy any existing session data you want to preserve
2. Delete the old session from the store
3. Create a new session with a fresh ID
4. Return the new session ID

Also look at the cookie attributes -- `httpOnly`, `secure`, and `sameSite` should all be set to prevent cookie theft and misuse.
