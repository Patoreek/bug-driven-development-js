// Auth utility functions for token management

export interface TokenPayload {
  userId: string;
  email: string;
  exp: number;
}

export interface RefreshResult {
  success: boolean;
  accessToken?: string;
  error?: string;
}

export function verifyAccessToken(token: string | undefined): TokenPayload | null {
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      return null;
    }

    return payload as TokenPayload;
  } catch {
    return null;
  }
}

export function refreshAccessToken(refreshToken: string | undefined): RefreshResult {
  if (!refreshToken) {
    return { success: false, error: "No refresh token" };
  }

  try {
    const payload = JSON.parse(atob(refreshToken));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      return { success: false, error: "Refresh token expired" };
    }

    const newPayload: TokenPayload = {
      userId: payload.userId,
      email: payload.email,
      exp: now + 900,
    };

    return {
      success: true,
      accessToken: btoa(JSON.stringify(newPayload)),
    };
  } catch {
    return { success: false, error: "Invalid refresh token" };
  }
}

export const PUBLIC_PATHS = ["/login", "/register", "/forgot-password", "/api/auth"];

export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => pathname.startsWith(path));
}
