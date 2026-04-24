import { describe, it, expect } from "vitest";
import { fetchAllUsers, batchProcess, User } from "../utils";

function createMockFetchUser(
  failIds: string[]
): (id: string) => Promise<User> {
  return async (id: string): Promise<User> => {
    if (failIds.includes(id)) {
      throw new Error(`Failed to fetch user ${id}`);
    }
    return { id, name: `User ${id}`, email: `user${id}@example.com` };
  };
}

describe("fetchAllUsers", () => {
  it("should return all users when all requests succeed", async () => {
    const fetchUser = createMockFetchUser([]);
    const result = await fetchAllUsers(["1", "2", "3"], fetchUser);

    expect(result.succeeded).toHaveLength(3);
    expect(result.failed).toHaveLength(0);
    expect(result.succeeded.map((u) => u.id)).toEqual(["1", "2", "3"]);
  });

  it("should return partial results when some requests fail", async () => {
    const fetchUser = createMockFetchUser(["2"]);
    const result = await fetchAllUsers(["1", "2", "3"], fetchUser);

    expect(result.succeeded).toHaveLength(2);
    expect(result.succeeded.map((u) => u.id)).toEqual(
      expect.arrayContaining(["1", "3"])
    );
  });

  it("should collect failed request info", async () => {
    const fetchUser = createMockFetchUser(["2", "4"]);
    const result = await fetchAllUsers(["1", "2", "3", "4"], fetchUser);

    expect(result.failed).toHaveLength(2);
    expect(result.failed.map((f) => f.id)).toEqual(
      expect.arrayContaining(["2", "4"])
    );
    expect(result.failed[0].error).toBeTruthy();
  });

  it("should handle all requests failing", async () => {
    const fetchUser = createMockFetchUser(["1", "2", "3"]);
    const result = await fetchAllUsers(["1", "2", "3"], fetchUser);

    expect(result.succeeded).toHaveLength(0);
    expect(result.failed).toHaveLength(3);
  });

  it("should handle empty input", async () => {
    const fetchUser = createMockFetchUser([]);
    const result = await fetchAllUsers([], fetchUser);

    expect(result.succeeded).toHaveLength(0);
    expect(result.failed).toHaveLength(0);
  });
});

describe("batchProcess", () => {
  it("should return all results when all processing succeeds", async () => {
    const processFn = async (n: number) => n * 2;
    const result = await batchProcess([1, 2, 3], processFn);

    expect(result.results).toEqual([2, 4, 6]);
    expect(result.errors).toHaveLength(0);
  });

  it("should return partial results when some processing fails", async () => {
    const processFn = async (n: number) => {
      if (n === 2) throw new Error("Processing failed");
      return n * 2;
    };
    const result = await batchProcess([1, 2, 3], processFn);

    expect(result.results).toHaveLength(2);
    expect(result.results).toEqual(expect.arrayContaining([2, 6]));
    expect(result.errors).toHaveLength(1);
  });

  it("should include the original item in error info", async () => {
    const processFn = async (n: number) => {
      if (n === 2) throw new Error("Bad number");
      return n * 2;
    };
    const result = await batchProcess([1, 2, 3], processFn);

    expect(result.errors[0].item).toBe(2);
    expect(result.errors[0].error).toContain("Bad number");
  });

  it("should handle all items failing", async () => {
    const processFn = async (_n: number): Promise<number> => {
      throw new Error("Everything is broken");
    };
    const result = await batchProcess([1, 2, 3], processFn);

    expect(result.results).toHaveLength(0);
    expect(result.errors).toHaveLength(3);
  });

  it("should handle empty input", async () => {
    const processFn = async (n: number) => n * 2;
    const result = await batchProcess([], processFn);

    expect(result.results).toHaveLength(0);
    expect(result.errors).toHaveLength(0);
  });
});
