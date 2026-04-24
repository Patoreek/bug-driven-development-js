import { describe, it, expect, beforeEach, vi } from "vitest";
import { middleware, type MiddlewareRequest } from "../middleware";
import { matcherConfig } from "../middleware";

function createToken(payload: Record<string, unknown>): string {
  return btoa(JSON.stringify(payload));
}

function makeRequest(overrides: Partial<MiddlewareRequest> = {}): MiddlewareRequest {
  return {
    pathname: "/dashboard",
    cookies: {},
    headers: {},
    ...overrides,
  };
}

describe("middleware - auth token handling", () => {
  it("allows requests with valid access token", () => {
    const token = createToken({
      userId: "user-1",
      email: "test@test.com",
      exp: Math.floor(Date.now() / 1000) + 3600, // expires in 1 hour
    });

    const response = middleware(makeRequest({
      cookies: { access_token: token },
    }));

    expect(response.type).toBe("next");
    expect(response.headers["x-user-id"]).toBe("user-1");
  });

  it("allows public paths without any token", () => {
    const response = middleware(makeRequest({
      pathname: "/login",
      cookies: {},
    }));

    expect(response.type).toBe("next");
  });

  it("refreshes expired access token when valid refresh token exists", () => {
    const expiredAccess = createToken({
      userId: "user-2",
      email: "refresh@test.com",
      exp: Math.floor(Date.now() / 1000) - 100, // expired 100 seconds ago
    });

    const validRefresh = createToken({
      userId: "user-2",
      email: "refresh@test.com",
      exp: Math.floor(Date.now() / 1000) + 604800, // valid for 7 days
    });

    const response = middleware(makeRequest({
      cookies: {
        access_token: expiredAccess,
        refresh_token: validRefresh,
      },
    }));

    // Should NOT redirect — should refresh and continue
    expect(response.type).toBe("next");
    // Should set the new access token cookie on the response
    expect(response.cookies["access_token"]).toBeDefined();
    expect(response.headers["x-user-id"]).toBe("user-2");
  });

  it("refreshes when access token is missing but refresh token exists", () => {
    const validRefresh = createToken({
      userId: "user-3",
      email: "noacccess@test.com",
      exp: Math.floor(Date.now() / 1000) + 604800,
    });

    const response = middleware(makeRequest({
      cookies: {
        refresh_token: validRefresh,
      },
    }));

    expect(response.type).toBe("next");
    expect(response.cookies["access_token"]).toBeDefined();
    expect(response.headers["x-user-id"]).toBe("user-3");
  });

  it("redirects to login when both tokens are expired", () => {
    const expiredAccess = createToken({
      userId: "user-4",
      email: "expired@test.com",
      exp: Math.floor(Date.now() / 1000) - 100,
    });

    const expiredRefresh = createToken({
      userId: "user-4",
      email: "expired@test.com",
      exp: Math.floor(Date.now() / 1000) - 100,
    });

    const response = middleware(makeRequest({
      cookies: {
        access_token: expiredAccess,
        refresh_token: expiredRefresh,
      },
    }));

    expect(response.type).toBe("redirect");
    expect(response.destination).toBe("/login");
  });

  it("redirects to login when no tokens exist at all", () => {
    const response = middleware(makeRequest({
      cookies: {},
    }));

    expect(response.type).toBe("redirect");
    expect(response.destination).toBe("/login");
  });
});

describe("middleware - matcher config", () => {
  it("exports a matcher config", () => {
    expect(matcherConfig).toBeDefined();
    expect(matcherConfig.matcher).toBeDefined();
  });

  it("matcher excludes _next/static paths", () => {
    const matchers: string[] = matcherConfig.matcher;
    // The matcher should use a negative lookahead or not include static paths
    const hasStaticExclusion = matchers.some(
      (m: string) => m.includes("_next/static") || m.includes("(?!")
    );
    expect(hasStaticExclusion).toBe(true);
  });

  it("matcher excludes _next/image paths", () => {
    const matchers: string[] = matcherConfig.matcher;
    const hasImageExclusion = matchers.some(
      (m: string) => m.includes("_next/image") || m.includes("(?!")
    );
    expect(hasImageExclusion).toBe(true);
  });

  it("matcher excludes favicon.ico", () => {
    const matchers: string[] = matcherConfig.matcher;
    const hasFaviconExclusion = matchers.some(
      (m: string) => m.includes("favicon.ico") || m.includes("(?!")
    );
    expect(hasFaviconExclusion).toBe(true);
  });
});
