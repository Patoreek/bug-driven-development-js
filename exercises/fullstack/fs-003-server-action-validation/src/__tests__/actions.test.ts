import { createTicket, clearTickets, type ActionResult } from "../actions";

function makeFormData(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    fd.set(key, value);
  }
  return fd;
}

describe("createTicket server action", () => {
  beforeEach(() => {
    clearTickets();
  });

  it("accepts valid ticket data", async () => {
    const result = await createTicket(
      makeFormData({
        title: "Login page broken",
        description: "Users cannot log in after the latest deploy.",
        priority: "2",
        email: "reporter@company.com",
      })
    );

    expect(result.success).toBe(true);
    expect(result.ticket).toBeDefined();
    expect(result.ticket!.title).toBe("Login page broken");
    expect(result.ticket!.priority).toBe(2);
  });

  it("rejects empty title", async () => {
    const result = await createTicket(
      makeFormData({
        title: "",
        description: "Some description",
        priority: "1",
        email: "test@example.com",
      })
    );

    expect(result.success).toBe(false);
    expect(result.fieldErrors).toBeDefined();
    expect(result.fieldErrors!.title).toBeDefined();
  });

  it("rejects missing description", async () => {
    const fd = new FormData();
    fd.set("title", "Valid title");
    fd.set("priority", "1");
    fd.set("email", "test@example.com");
    // description is missing entirely

    const result = await createTicket(fd);

    expect(result.success).toBe(false);
    expect(result.fieldErrors).toBeDefined();
    expect(result.fieldErrors!.description).toBeDefined();
  });

  it("rejects title that is too long", async () => {
    const result = await createTicket(
      makeFormData({
        title: "A".repeat(201),
        description: "Valid description",
        priority: "1",
        email: "test@example.com",
      })
    );

    expect(result.success).toBe(false);
    expect(result.fieldErrors!.title).toBeDefined();
  });

  it("rejects invalid priority (must be 1-5)", async () => {
    const result = await createTicket(
      makeFormData({
        title: "Valid title",
        description: "Valid description",
        priority: "99",
        email: "test@example.com",
      })
    );

    expect(result.success).toBe(false);
    expect(result.fieldErrors!.priority).toBeDefined();
  });

  it("rejects non-numeric priority", async () => {
    const result = await createTicket(
      makeFormData({
        title: "Valid title",
        description: "Valid description",
        priority: "high",
        email: "test@example.com",
      })
    );

    expect(result.success).toBe(false);
    expect(result.fieldErrors!.priority).toBeDefined();
  });

  it("rejects invalid email format", async () => {
    const result = await createTicket(
      makeFormData({
        title: "Valid title",
        description: "Valid description",
        priority: "3",
        email: "not-an-email",
      })
    );

    expect(result.success).toBe(false);
    expect(result.fieldErrors!.email).toBeDefined();
  });

  it("rejects completely empty form data", async () => {
    const result = await createTicket(new FormData());
    expect(result.success).toBe(false);
    expect(result.fieldErrors).toBeDefined();
  });

  it("does not create a ticket when validation fails", async () => {
    const { getTickets } = await import("../actions");

    await createTicket(
      makeFormData({
        title: "",
        description: "",
        priority: "invalid",
        email: "bad",
      })
    );

    expect(getTickets()).toHaveLength(0);
  });

  it("coerces priority string to number on success", async () => {
    const result = await createTicket(
      makeFormData({
        title: "Priority test",
        description: "Testing priority coercion",
        priority: "4",
        email: "test@example.com",
      })
    );

    expect(result.success).toBe(true);
    expect(typeof result.ticket!.priority).toBe("number");
    expect(result.ticket!.priority).toBe(4);
  });
});
