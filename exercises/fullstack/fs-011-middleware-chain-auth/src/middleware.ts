// BUG: This middleware has two problems:
// 1. It never attempts to refresh an expired access token using the refresh token
// 2. It has no config.matcher, so it runs on ALL requests including static assets

import { verifyAccessToken, isPublicPath } from "./auth";

// Simulates Next.js request/response types for exercise purposes
export interface MiddlewareRequest {
  pathname: string;
  cookies: Record<string, string | undefined>;
  headers: Record<string, string>;
}

export interface MiddlewareResponse {
  type: "next" | "redirect";
  destination?: string;
  cookies: Record<string, string>;
  headers: Record<string, string>;
}

function createNextResponse(headers: Record<string, string> = {}): MiddlewareResponse {
  return { type: "next", cookies: {}, headers };
}

function createRedirectResponse(destination: string): MiddlewareResponse {
  return { type: "redirect", destination, cookies: {}, headers: {} };
}

export function middleware(request: MiddlewareRequest): MiddlewareResponse {
  const { pathname } = request;

  // Allow public paths
  if (isPublicPath(pathname)) {
    return createNextResponse();
  }

  const accessToken = request.cookies["access_token"];

  // BUG: Only checks access token. If expired, immediately redirects.
  // Never checks for refresh token or attempts to refresh.
  const payload = verifyAccessToken(accessToken);

  if (!payload) {
    // BUG: Directly redirects to login without trying refresh
    return createRedirectResponse("/login");
  }

  // Token is valid, add user info to headers
  return createNextResponse({
    "x-user-id": payload.userId,
    "x-user-email": payload.email,
  });
}

// BUG: No config.matcher export — middleware runs on ALL requests
// including _next/static/*, _next/image/*, favicon.ico, etc.
// This wastes resources and adds latency to static asset requests.
