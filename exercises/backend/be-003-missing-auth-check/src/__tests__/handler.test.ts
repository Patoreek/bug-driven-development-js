import { describe, it, expect } from "vitest";
import { handleDeleteArticle } from "../handler";

describe("handleDeleteArticle", () => {
  // Authentication tests
  it("should return 401 when no token is provided", async () => {
    const result = await handleDeleteArticle({
      token: null,
      articleId: "article-1",
    });

    expect(result.status).toBe(401);
    expect(result.body.message).toContain("Authentication");
  });

  it("should return 401 when an invalid token is provided", async () => {
    const result = await handleDeleteArticle({
      token: "invalid-token",
      articleId: "article-1",
    });

    expect(result.status).toBe(401);
    expect(result.body.message).toContain("Invalid");
  });

  // Authorization tests — role-based
  it("should return 403 when a viewer tries to delete an article", async () => {
    const result = await handleDeleteArticle({
      token: "token-viewer-4",
      articleId: "article-1",
    });

    expect(result.status).toBe(403);
    expect(result.body.message).toMatch(/permission|forbidden|authorized/i);
  });

  it("should allow an admin to delete any article", async () => {
    const result = await handleDeleteArticle({
      token: "token-admin-1",
      articleId: "article-1",
    });

    expect(result.status).toBe(200);
    expect(result.body.message).toContain("deleted");
  });

  it("should allow an editor to delete their own article", async () => {
    // article-1 is authored by user-2, token-editor-2 belongs to user-2
    const result = await handleDeleteArticle({
      token: "token-editor-2",
      articleId: "article-1",
    });

    expect(result.status).toBe(200);
    expect(result.body.message).toContain("deleted");
  });

  // Authorization tests — ownership
  it("should return 403 when an editor tries to delete another user's article", async () => {
    // article-1 is authored by user-2, token-editor-3 belongs to user-3
    const result = await handleDeleteArticle({
      token: "token-editor-3",
      articleId: "article-1",
    });

    expect(result.status).toBe(403);
    expect(result.body.message).toMatch(/permission|own|authorized/i);
  });

  it("should allow admin to delete articles by other users", async () => {
    // article-2 is authored by user-3, but admin should delete anything
    const result = await handleDeleteArticle({
      token: "token-admin-1",
      articleId: "article-2",
    });

    expect(result.status).toBe(200);
    expect(result.body.message).toContain("deleted");
  });

  // 404 test
  it("should return 404 when article does not exist for admin", async () => {
    const result = await handleDeleteArticle({
      token: "token-admin-1",
      articleId: "nonexistent",
    });

    expect(result.status).toBe(404);
    expect(result.body.message).toContain("not found");
  });

  it("should return 404 when article does not exist for editor", async () => {
    const result = await handleDeleteArticle({
      token: "token-editor-2",
      articleId: "nonexistent",
    });

    expect(result.status).toBe(404);
    expect(result.body.message).toContain("not found");
  });
});
