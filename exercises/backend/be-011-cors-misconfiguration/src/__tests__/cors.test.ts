import { getCorsHeaders } from "../cors";

describe("CORS Middleware", () => {
  describe("origin validation", () => {
    it("sets origin header for allowed origin", () => {
      const result = getCorsHeaders({
        method: "GET",
        headers: { origin: "https://app.example.com" },
      });
      expect(result.headers["Access-Control-Allow-Origin"]).toBe(
        "https://app.example.com"
      );
    });

    it("sets origin header for second allowed origin", () => {
      const result = getCorsHeaders({
        method: "GET",
        headers: { origin: "https://admin.example.com" },
      });
      expect(result.headers["Access-Control-Allow-Origin"]).toBe(
        "https://admin.example.com"
      );
    });

    it("does not set origin header for disallowed origin", () => {
      const result = getCorsHeaders({
        method: "GET",
        headers: { origin: "https://evil.com" },
      });
      expect(result.headers["Access-Control-Allow-Origin"]).toBeUndefined();
    });

    it("does not set origin header when origin is missing", () => {
      const result = getCorsHeaders({
        method: "GET",
        headers: {},
      });
      expect(result.headers["Access-Control-Allow-Origin"]).toBeUndefined();
    });

    it("never uses wildcard * for origin", () => {
      const result = getCorsHeaders({
        method: "GET",
        headers: { origin: "https://app.example.com" },
      });
      expect(result.headers["Access-Control-Allow-Origin"]).not.toBe("*");
    });
  });

  describe("credentials", () => {
    it("sets credentials header for allowed origin", () => {
      const result = getCorsHeaders({
        method: "GET",
        headers: { origin: "https://app.example.com" },
      });
      expect(result.headers["Access-Control-Allow-Credentials"]).toBe("true");
    });

    it("does not set credentials header for disallowed origin", () => {
      const result = getCorsHeaders({
        method: "GET",
        headers: { origin: "https://evil.com" },
      });
      expect(
        result.headers["Access-Control-Allow-Credentials"]
      ).toBeUndefined();
    });
  });

  describe("preflight handling", () => {
    it("identifies OPTIONS request as preflight", () => {
      const result = getCorsHeaders({
        method: "OPTIONS",
        headers: { origin: "https://app.example.com" },
      });
      expect(result.isPreflight).toBe(true);
    });

    it("identifies non-OPTIONS request as not preflight", () => {
      const result = getCorsHeaders({
        method: "GET",
        headers: { origin: "https://app.example.com" },
      });
      expect(result.isPreflight).toBe(false);
    });

    it("sets Allow-Methods header on preflight", () => {
      const result = getCorsHeaders({
        method: "OPTIONS",
        headers: { origin: "https://app.example.com" },
      });
      const methods = result.headers["Access-Control-Allow-Methods"];
      expect(methods).toBeDefined();
      expect(methods).toContain("GET");
      expect(methods).toContain("POST");
      expect(methods).toContain("PUT");
      expect(methods).toContain("DELETE");
      expect(methods).toContain("PATCH");
    });

    it("sets Allow-Headers header on preflight", () => {
      const result = getCorsHeaders({
        method: "OPTIONS",
        headers: { origin: "https://app.example.com" },
      });
      const headers = result.headers["Access-Control-Allow-Headers"];
      expect(headers).toBeDefined();
      expect(headers).toContain("Content-Type");
      expect(headers).toContain("Authorization");
      expect(headers).toContain("X-Request-ID");
    });

    it("sets Max-Age header on preflight", () => {
      const result = getCorsHeaders({
        method: "OPTIONS",
        headers: { origin: "https://app.example.com" },
      });
      expect(result.headers["Access-Control-Max-Age"]).toBeDefined();
    });

    it("does not set preflight-specific headers on regular requests", () => {
      const result = getCorsHeaders({
        method: "GET",
        headers: { origin: "https://app.example.com" },
      });
      expect(
        result.headers["Access-Control-Allow-Methods"]
      ).toBeUndefined();
      expect(
        result.headers["Access-Control-Allow-Headers"]
      ).toBeUndefined();
      expect(result.headers["Access-Control-Max-Age"]).toBeUndefined();
    });

    it("does not set any CORS headers for disallowed preflight origin", () => {
      const result = getCorsHeaders({
        method: "OPTIONS",
        headers: { origin: "https://evil.com" },
      });
      expect(result.headers["Access-Control-Allow-Origin"]).toBeUndefined();
      expect(result.headers["Access-Control-Allow-Methods"]).toBeUndefined();
      expect(result.headers["Access-Control-Allow-Headers"]).toBeUndefined();
    });
  });
});
