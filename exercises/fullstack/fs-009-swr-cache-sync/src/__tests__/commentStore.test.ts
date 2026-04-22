import { getComments, addComment, resetStore } from "../commentStore";

describe("SWR cache sync after mutation", () => {
  beforeEach(() => {
    resetStore();
  });

  it("fetches initial comments for a post", async () => {
    const comments = await getComments("post-1");
    expect(comments).toHaveLength(2);
    expect(comments[0].author).toBe("Alice");
    expect(comments[1].author).toBe("Bob");
  });

  it("returns empty array for post with no comments", async () => {
    const comments = await getComments("post-999");
    expect(comments).toHaveLength(0);
  });

  it("addComment returns the new comment", async () => {
    const comment = await addComment("post-1", "Carol", "Nice work!");
    expect(comment.author).toBe("Carol");
    expect(comment.text).toBe("Nice work!");
    expect(comment.postId).toBe("post-1");
    expect(comment.id).toBeDefined();
  });

  it("getComments reflects new comment after addComment", async () => {
    // Populate cache
    const before = await getComments("post-1");
    expect(before).toHaveLength(2);

    // Add a new comment
    await addComment("post-1", "Carol", "Nice work!");

    // Cache should reflect the new comment
    const after = await getComments("post-1");
    expect(after).toHaveLength(3);
    expect(after[2].author).toBe("Carol");
  });

  it("adding multiple comments keeps cache in sync", async () => {
    await getComments("post-1"); // populate cache

    await addComment("post-1", "Carol", "First!");
    await addComment("post-1", "Dave", "Second!");

    const comments = await getComments("post-1");
    expect(comments).toHaveLength(4);
    expect(comments.map((c) => c.author)).toEqual([
      "Alice",
      "Bob",
      "Carol",
      "Dave",
    ]);
  });

  it("adding comment to one post doesn't affect another post's cache", async () => {
    await getComments("post-1"); // populate post-1 cache

    await addComment("post-2", "Eve", "Hello from post 2!");

    const post1Comments = await getComments("post-1");
    expect(post1Comments).toHaveLength(2); // unchanged

    const post2Comments = await getComments("post-2");
    expect(post2Comments).toHaveLength(1);
  });

  it("cache is used on subsequent reads (no unnecessary refetch)", async () => {
    const first = await getComments("post-1");
    const second = await getComments("post-1");

    // Should return the same reference if using cache
    expect(first).toBe(second);
  });
});
