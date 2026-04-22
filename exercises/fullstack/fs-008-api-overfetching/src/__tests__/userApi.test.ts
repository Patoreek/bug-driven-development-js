import { getUsersForList, getUsersForCard, getUserProfile } from "../userApi";

describe("API overfetching", () => {
  describe("getUsersForList", () => {
    it("returns all users", () => {
      const list = getUsersForList();
      expect(list).toHaveLength(2);
    });

    it("includes only id, name, and avatar", () => {
      const list = getUsersForList();
      const keys = Object.keys(list[0]);
      expect(keys).toEqual(expect.arrayContaining(["id", "name", "avatar"]));
      expect(keys).toHaveLength(3);
    });

    it("does not include email, bio, role, or other fields", () => {
      const list = getUsersForList();
      const item = list[0] as Record<string, unknown>;
      expect(item).not.toHaveProperty("email");
      expect(item).not.toHaveProperty("bio");
      expect(item).not.toHaveProperty("role");
      expect(item).not.toHaveProperty("preferences");
      expect(item).not.toHaveProperty("phone");
      expect(item).not.toHaveProperty("address");
    });
  });

  describe("getUsersForCard", () => {
    it("returns all users", () => {
      const cards = getUsersForCard();
      expect(cards).toHaveLength(2);
    });

    it("includes only id, name, role, and department", () => {
      const cards = getUsersForCard();
      const keys = Object.keys(cards[0]);
      expect(keys).toEqual(expect.arrayContaining(["id", "name", "role", "department"]));
      expect(keys).toHaveLength(4);
    });

    it("does not include email, avatar, bio, or other fields", () => {
      const cards = getUsersForCard();
      const item = cards[0] as Record<string, unknown>;
      expect(item).not.toHaveProperty("email");
      expect(item).not.toHaveProperty("avatar");
      expect(item).not.toHaveProperty("bio");
      expect(item).not.toHaveProperty("preferences");
    });
  });

  describe("getUserProfile", () => {
    it("returns the user for a valid id", () => {
      const profile = getUserProfile("1");
      expect(profile).toBeDefined();
      expect(profile!.name).toBe("Alice Johnson");
    });

    it("returns undefined for an invalid id", () => {
      expect(getUserProfile("999")).toBeUndefined();
    });

    it("does not include preferences", () => {
      const profile = getUserProfile("1") as Record<string, unknown>;
      expect(profile).not.toHaveProperty("preferences");
    });

    it("does not include phone or address", () => {
      const profile = getUserProfile("1") as Record<string, unknown>;
      expect(profile).not.toHaveProperty("phone");
      expect(profile).not.toHaveProperty("address");
    });

    it("includes public fields like name, email, bio, role", () => {
      const profile = getUserProfile("1");
      expect(profile).toHaveProperty("name");
      expect(profile).toHaveProperty("email");
      expect(profile).toHaveProperty("bio");
      expect(profile).toHaveProperty("role");
    });
  });
});
