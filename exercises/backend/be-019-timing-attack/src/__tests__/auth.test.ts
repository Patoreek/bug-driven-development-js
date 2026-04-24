import { validateToken, safeCompare, authenticateRequest } from "../auth";

describe("auth — Timing Attack Prevention", () => {
  describe("safeCompare", () => {
    it("returns true for equal strings", () => {
      expect(safeCompare("hello", "hello")).toBe(true);
    });

    it("returns false for different strings of same length", () => {
      expect(safeCompare("hello", "world")).toBe(false);
    });

    it("returns false for different length strings", () => {
      expect(safeCompare("short", "much longer string")).toBe(false);
    });

    it("returns true for empty strings", () => {
      expect(safeCompare("", "")).toBe(true);
    });

    // This is the critical timing attack test:
    // safeCompare must NOT use === (which short-circuits on first mismatch).
    // It must use a constant-time algorithm.
    it("does NOT use === for comparison (uses constant-time algorithm)", () => {
      // We verify this by checking the implementation uses crypto.timingSafeEqual
      // or equivalent. We test that the function source doesn't contain a bare ===
      // comparison of the two arguments.
      const fnSource = safeCompare.toString();

      // The function should NOT simply be `return a === b`
      // It should use Buffer and timingSafeEqual or equivalent constant-time logic
      const isSimpleEquality = /^\s*(?:function\s*)?\(?\s*\w+\s*,\s*\w+\s*\)?\s*(?:=>)?\s*\{?\s*return\s+\w+\s*===\s*\w+;?\s*\}?\s*$/.test(
        fnSource.replace(/\n/g, " ")
      );
      expect(isSimpleEquality).toBe(false);
    });

    it("handles unicode strings correctly", () => {
      expect(safeCompare("caf\u00e9", "caf\u00e9")).toBe(true);
      expect(safeCompare("caf\u00e9", "cafes")).toBe(false);
    });

    it("handles special characters", () => {
      const token1 = "tok_test_a1b2c3!@#$%^&*()";
      const token2 = "tok_test_a1b2c3!@#$%^&*()";
      expect(safeCompare(token1, token2)).toBe(true);
    });
  });

  describe("validateToken", () => {
    it("validates a correct token", () => {
      const result = validateToken(
        "tok_test_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
      );
      expect(result.valid).toBe(true);
      expect(result.userId).toBe("user-1");
    });

    it("rejects an invalid token", () => {
      const result = validateToken("tok_test_invalid_token_here_12345678");
      expect(result.valid).toBe(false);
      expect(result.error).toBe("Invalid token");
    });

    it("rejects empty token", () => {
      const result = validateToken("");
      expect(result.valid).toBe(false);
      expect(result.error).toBe("Token is required");
    });

    it("rejects token with wrong prefix", () => {
      const result = validateToken("wrong_prefix_a1b2c3d4e5f6g7h8i9j0k1l2");
      expect(result.valid).toBe(false);
      expect(result.error).toBe("Invalid token format");
    });

    it("validates second user token", () => {
      const result = validateToken(
        "tok_test_q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2"
      );
      expect(result.valid).toBe(true);
      expect(result.userId).toBe("user-2");
    });

    // Critical: validateToken must use safeCompare internally,
    // not direct === comparison
    it("uses constant-time comparison internally", () => {
      const fnSource = validateToken.toString();
      // Should NOT contain a direct === comparison between token variables
      // Should reference safeCompare or timingSafeEqual
      expect(
        fnSource.includes("safeCompare") ||
        fnSource.includes("timingSafeEqual")
      ).toBe(true);
    });
  });

  describe("authenticateRequest", () => {
    it("extracts and validates a Bearer token", () => {
      const result = authenticateRequest({
        authorization:
          "Bearer tok_test_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
      });
      expect(result.valid).toBe(true);
      expect(result.userId).toBe("user-1");
    });

    it("rejects missing authorization header", () => {
      const result = authenticateRequest({});
      expect(result.valid).toBe(false);
      expect(result.error).toBe("Authorization header missing");
    });

    it("rejects malformed authorization header", () => {
      const result = authenticateRequest({
        authorization: "Basic dXNlcjpwYXNz",
      });
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Invalid authorization format");
    });

    it("handles case-insensitive header name", () => {
      const result = authenticateRequest({
        Authorization:
          "Bearer tok_test_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
      });
      expect(result.valid).toBe(true);
    });
  });
});
