import { getTask, createTask, deleteTask, updateTask } from "../handlers";

describe("API Error Responses", () => {
  describe("getTask", () => {
    it("returns 400 with standard error format when ID is missing", () => {
      const res = getTask("");
      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        error: { code: "VALIDATION_ERROR", message: "ID is required" },
      });
    });

    it("returns 404 with standard error format when task not found", () => {
      const res = getTask("999");
      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        error: { code: "NOT_FOUND", message: "Task not found" },
      });
    });

    it("returns 200 with data on success", () => {
      const res = getTask("1");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        data: { id: "1", title: "Buy groceries", completed: false },
      });
    });
  });

  describe("createTask", () => {
    it("returns 400 with standard error format when title is missing", () => {
      const res = createTask({});
      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        error: { code: "VALIDATION_ERROR", message: "Title is required" },
      });
    });

    it("returns 400 with standard error format when title is empty string", () => {
      const res = createTask({ title: "   " });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        error: { code: "VALIDATION_ERROR", message: "Title is required" },
      });
    });

    it("returns 400 with standard error format when title is too long", () => {
      const res = createTask({ title: "a".repeat(101) });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        error: { code: "VALIDATION_ERROR", message: "Title too long" },
      });
    });

    it("returns 201 with data on success", () => {
      const res = createTask({ title: "New task" });
      expect(res.status).toBe(201);
      expect(res.body.data).toMatchObject({
        title: "New task",
        completed: false,
      });
    });
  });

  describe("deleteTask", () => {
    it("returns 400 with standard error format when ID is missing", () => {
      const res = deleteTask("");
      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        error: { code: "VALIDATION_ERROR", message: "ID is required" },
      });
    });

    it("returns 404 with standard error format when task not found", () => {
      const res = deleteTask("999");
      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        error: { code: "NOT_FOUND", message: "Task not found" },
      });
    });
  });

  describe("updateTask", () => {
    it("returns 400 with standard error format when ID is missing", () => {
      const res = updateTask("", { title: "Updated" });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        error: { code: "VALIDATION_ERROR", message: "ID is required" },
      });
    });

    it("returns 404 with standard error format when task not found", () => {
      const res = updateTask("999", { title: "Updated" });
      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        error: { code: "NOT_FOUND", message: "Task not found" },
      });
    });

    it("returns 400 with standard error format when title is empty", () => {
      const res = updateTask("1", { title: "" });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        error: {
          code: "VALIDATION_ERROR",
          message: "Title cannot be empty",
        },
      });
    });

    it("returns 200 with data on success", () => {
      const res = updateTask("1", { title: "Updated groceries" });
      expect(res.status).toBe(200);
      expect(res.body.data).toMatchObject({
        id: "1",
        title: "Updated groceries",
      });
    });
  });

  describe("all error responses follow standard format", () => {
    it("error responses always have error.code and error.message", () => {
      const errorResponses = [
        getTask(""),
        getTask("999"),
        createTask({}),
        createTask({ title: "a".repeat(101) }),
        deleteTask(""),
        deleteTask("999"),
        updateTask("", {}),
        updateTask("999", {}),
        updateTask("1", { title: "" }),
      ];

      for (const res of errorResponses) {
        expect(res.body).toHaveProperty("error");
        const error = res.body.error as { code: string; message: string };
        expect(error).toHaveProperty("code");
        expect(error).toHaveProperty("message");
        expect(typeof error.code).toBe("string");
        expect(typeof error.message).toBe("string");
      }
    });

    it("error responses never have msg or top-level message keys", () => {
      const errorResponses = [
        getTask(""),
        getTask("999"),
        createTask({}),
        deleteTask(""),
        deleteTask("999"),
        updateTask("", {}),
        updateTask("999", {}),
      ];

      for (const res of errorResponses) {
        expect(res.body).not.toHaveProperty("msg");
        expect(res.body).not.toHaveProperty("message");
      }
    });
  });
});
