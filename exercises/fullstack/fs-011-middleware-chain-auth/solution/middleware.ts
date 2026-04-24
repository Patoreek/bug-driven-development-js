import { verifyAccessToken, refreshAccessToken, isPublicPath } from "./auth";

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
  const refreshToken = request.cookies["refresh_token"];

  // First, try to verify the access token
  let payload = verifyAccessToken(accessToken);

  if (payload) {
    // Access token is valid, proceed
    return createNextResponse({
      "x-user-id": payload.userId,
      "x-user-email": payload.email,
    });
  }

  // Access token invalid/expired — try to refresh
  const refreshResult = refreshAccessToken(refreshToken);

  if (refreshResult.success && refreshResult.accessToken) {
    // Verify the new access token to extract payload
    payload = verifyAccessToken(refreshResult.accessToken);

    if (payload) {
      const response = createNextResponse({
        "x-user-id": payload.userId,
        "x-user-email": payload.email,
      });

      // Set the new access token cookie on the response
      response.cookies["access_token"] = refreshResult.accessToken;
      return response;
    }
  }

  // Both tokens invalid — redirect to login
  return createRedirectResponse("/login");
}

// FIX: Export matcher config to exclude static assets and public routes
export const matcherConfig = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
