import { describe, it, expect } from "vitest";
import {
  createFormValues,
  createFormGetters,
  createFormSetters,
  type FormSchema,
  type FormValues,
  type FormGetters,
  type FormSetters,
} from "../formBuilder";

const schema = {
  username: { type: "text" as const, required: true, label: "Username" },
  age: { type: "number" as const, required: true, label: "Age" },
  active: { type: "boolean" as const, required: false, label: "Active" },
  role: {
    type: "select" as const,
    required: true,
    label: "Role",
    options: ["admin", "user", "guest"],
  },
} satisfies FormSchema;

type TestSchema = typeof schema;

describe("createFormValues", () => {
  it("creates default values based on field types", () => {
    const values = createFormValues(schema);
    expect(values.username).toBe("");
    expect(values.age).toBe(0);
    expect(values.active).toBe(false);
    expect(values.role).toBe("admin");
  });

  it("uses provided initial values", () => {
    const values = createFormValues(schema, {
      username: "alice",
      age: 30,
      active: true,
      role: "user",
    });
    expect(values.username).toBe("alice");
    expect(values.age).toBe(30);
    expect(values.active).toBe(true);
    expect(values.role).toBe("user");
  });

  it("value types should match field types", () => {
    const values = createFormValues(schema);
    // text -> string
    expect(typeof values.username).toBe("string");
    // number -> number
    expect(typeof values.age).toBe("number");
    // boolean -> boolean
    expect(typeof values.active).toBe("boolean");
    // select -> string
    expect(typeof values.role).toBe("string");
  });
});

describe("createFormGetters", () => {
  it("creates getter functions with get{FieldName} naming", () => {
    const values = createFormValues(schema, { username: "alice", age: 25 });
    const getters = createFormGetters(schema, values);

    // Should have getUsername, getAge, getActive, getRole
    expect(typeof (getters as any).getUsername).toBe("function");
    expect(typeof (getters as any).getAge).toBe("function");
    expect(typeof (getters as any).getActive).toBe("function");
    expect(typeof (getters as any).getRole).toBe("function");
  });

  it("getter functions return the current value", () => {
    const values = createFormValues(schema, {
      username: "bob",
      age: 42,
      active: true,
      role: "guest",
    });
    const getters = createFormGetters(schema, values);

    expect((getters as any).getUsername()).toBe("bob");
    expect((getters as any).getAge()).toBe(42);
    expect((getters as any).getActive()).toBe(true);
    expect((getters as any).getRole()).toBe("guest");
  });
});

describe("createFormSetters", () => {
  it("creates setter functions with set{FieldName} naming", () => {
    const values = createFormValues(schema);
    const setters = createFormSetters(schema, values);

    expect(typeof (setters as any).setUsername).toBe("function");
    expect(typeof (setters as any).setAge).toBe("function");
    expect(typeof (setters as any).setActive).toBe("function");
    expect(typeof (setters as any).setRole).toBe("function");
  });

  it("setter functions update the values", () => {
    const values = createFormValues(schema);
    const setters = createFormSetters(schema, values);

    (setters as any).setUsername("charlie");
    expect(values.username).toBe("charlie");

    (setters as any).setAge(99);
    expect(values.age).toBe(99);

    (setters as any).setActive(true);
    expect(values.active).toBe(true);
  });
});

describe("getters and setters work together", () => {
  it("getter reflects value after setter is called", () => {
    const values = createFormValues(schema);
    const getters = createFormGetters(schema, values);
    const setters = createFormSetters(schema, values);

    (setters as any).setUsername("dave");
    expect((getters as any).getUsername()).toBe("dave");

    (setters as any).setAge(55);
    expect((getters as any).getAge()).toBe(55);
  });
});
