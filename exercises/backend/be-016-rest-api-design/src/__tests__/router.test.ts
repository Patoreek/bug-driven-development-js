import {
  getListUsersRoute,
  getGetUserRoute,
  getCreateUserRoute,
  getUpdateUserRoute,
  getDeleteUserRoute,
  handleListUsers,
  handleGetUser,
  handleCreateUser,
  handleUpdateUser,
  handleDeleteUser,
} from "../router";

describe("REST API Design", () => {
  describe("route definitions - HTTP methods", () => {
    it("list users uses GET method", () => {
      expect(getListUsersRoute().method).toBe("GET");
    });

    it("get user uses GET method", () => {
      expect(getGetUserRoute("1").method).toBe("GET");
    });

    it("create user uses POST method", () => {
      expect(getCreateUserRoute().method).toBe("POST");
    });

    it("update user uses PUT method", () => {
      expect(getUpdateUserRoute("1").method).toBe("PUT");
    });

    it("delete user uses DELETE method", () => {
      expect(getDeleteUserRoute("1").method).toBe("DELETE");
    });
  });

  describe("route definitions - resource-based URLs", () => {
    it("list users URL is /api/users", () => {
      expect(getListUsersRoute().path).toBe("/api/users");
    });

    it("get user URL is /api/users/:id", () => {
      expect(getGetUserRoute("42").path).toBe("/api/users/42");
    });

    it("create user URL is /api/users", () => {
      expect(getCreateUserRoute().path).toBe("/api/users");
    });

    it("update user URL is /api/users/:id", () => {
      expect(getUpdateUserRoute("42").path).toBe("/api/users/42");
    });

    it("delete user URL is /api/users/:id", () => {
      expect(getDeleteUserRoute("42").path).toBe("/api/users/42");
    });

    it("no route URL contains a verb", () => {
      const routes = [
        getListUsersRoute(),
        getGetUserRoute("1"),
        getCreateUserRoute(),
        getUpdateUserRoute("1"),
        getDeleteUserRoute("1"),
      ];

      const verbs = ["get", "fetch", "create", "update", "remove", "delete"];
      for (const route of routes) {
        const pathLower = route.path.toLowerCase();
        for (const verb of verbs) {
          expect(pathLower).not.toContain(verb);
        }
      }
    });
  });

  describe("handler status codes", () => {
    it("list users returns 200", () => {
      const res = handleListUsers();
      expect(res.status).toBe(200);
    });

    it("get user returns 200 on success", () => {
      const res = handleGetUser("1");
      expect(res.status).toBe(200);
    });

    it("get user returns 404 when not found", () => {
      const res = handleGetUser("999");
      expect(res.status).toBe(404);
    });

    it("create user returns 201", () => {
      const res = handleCreateUser({
        name: "Charlie",
        email: "charlie@example.com",
      });
      expect(res.status).toBe(201);
    });

    it("update user returns 200 on success", () => {
      const res = handleUpdateUser("1", { name: "Alice Updated" });
      expect(res.status).toBe(200);
    });

    it("update user returns 404 when not found", () => {
      const res = handleUpdateUser("999", { name: "Nobody" });
      expect(res.status).toBe(404);
    });

    it("delete user returns 204 on success", () => {
      const res = handleDeleteUser("2");
      expect(res.status).toBe(204);
    });

    it("delete user returns 404 when not found", () => {
      const res = handleDeleteUser("999");
      expect(res.status).toBe(404);
    });
  });

  describe("handler response bodies", () => {
    it("list users returns array of users in data field", () => {
      const res = handleListUsers();
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("get user returns user object in data field", () => {
      const res = handleGetUser("1");
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data).toHaveProperty("name");
    });

    it("create user returns created user in data field", () => {
      const res = handleCreateUser({
        name: "Diana",
        email: "diana@example.com",
      });
      expect(res.body.data).toMatchObject({
        name: "Diana",
        email: "diana@example.com",
      });
    });

    it("delete user returns empty body on success", () => {
      // 204 responses should have empty body
      const res = handleDeleteUser("1");
      expect(res.body).toEqual({});
    });
  });
});
