import { getBookmarks, addBookmark, deleteBookmark, clearBookmarks } from "../bookmarks";

describe("Bookmarks with cache revalidation", () => {
  beforeEach(() => {
    clearBookmarks();
  });

  it("returns empty array initially", () => {
    expect(getBookmarks()).toEqual([]);
  });

  it("adds a bookmark successfully", async () => {
    const result = await addBookmark("https://example.com", "Example");
    expect(result.success).toBe(true);
    expect(result.bookmark).toBeDefined();
    expect(result.bookmark!.url).toBe("https://example.com");
    expect(result.bookmark!.title).toBe("Example");
  });

  it("rejects bookmark with missing fields", async () => {
    const result = await addBookmark("", "");
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("getBookmarks reflects newly added bookmark", async () => {
    await addBookmark("https://example.com", "Example");

    const bookmarks = getBookmarks();
    expect(bookmarks).toHaveLength(1);
    expect(bookmarks[0].url).toBe("https://example.com");
  });

  it("getBookmarks reflects multiple additions", async () => {
    await addBookmark("https://one.com", "One");
    await addBookmark("https://two.com", "Two");

    const bookmarks = getBookmarks();
    expect(bookmarks).toHaveLength(2);
  });

  it("getBookmarks reflects deletion", async () => {
    const result = await addBookmark("https://example.com", "Example");
    const id = result.bookmark!.id;

    // Read once to populate cache
    expect(getBookmarks()).toHaveLength(1);

    // Delete and check cache is invalidated
    await deleteBookmark(id);

    expect(getBookmarks()).toHaveLength(0);
  });

  it("delete returns error for non-existent bookmark", async () => {
    const result = await deleteBookmark("non-existent");
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("cache is invalidated after add even if previously read", async () => {
    // First read populates cache
    expect(getBookmarks()).toEqual([]);

    // Add should invalidate cache
    await addBookmark("https://example.com", "Example");

    // Second read should see the new bookmark (not stale empty cache)
    expect(getBookmarks()).toHaveLength(1);
  });
});
