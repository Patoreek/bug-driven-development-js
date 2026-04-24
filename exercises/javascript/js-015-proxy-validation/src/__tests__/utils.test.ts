import { describe, it, expect } from "vitest";
import {
  createValidatedObject,
  createReadonly,
  Schema,
} from "../utils";

const userSchema: Schema = {
  name: { type: "string", required: true, minLength: 1, maxLength: 50 },
  age: { type: "number", required: true, min: 0, max: 150 },
  email: { type: "string", required: false },
  isActive: { type: "boolean", required: false },
};

describe("createValidatedObject", () => {
  describe("basic type validation", () => {
    it("should accept values matching the schema type", () => {
      const user = createValidatedObject(userSchema);

      expect(() => {
        user.name = "Alice";
      }).not.toThrow();

      expect(() => {
        user.age = 30;
      }).not.toThrow();

      expect(user.name).toBe("Alice");
      expect(user.age).toBe(30);
    });

    it("should reject values not matching the schema type", () => {
      const user = createValidatedObject(userSchema);

      expect(() => {
        user.age = "thirty" as unknown as number;
      }).toThrow(/type/);
    });

    it("should reject properties not in the schema", () => {
      const user = createValidatedObject(userSchema);

      expect(() => {
        user.unknownField = "value";
      }).toThrow(/not defined in schema/);
    });
  });

  describe("required field validation", () => {
    it("should reject null/undefined for required fields", () => {
      const user = createValidatedObject(userSchema);

      expect(() => {
        user.name = undefined as unknown as string;
      }).toThrow(/required/);

      expect(() => {
        user.age = null as unknown as number;
      }).toThrow(/required/);
    });

    it("should allow null/undefined for non-required fields", () => {
      const user = createValidatedObject(userSchema);

      expect(() => {
        user.email = undefined;
      }).not.toThrow();

      expect(() => {
        user.isActive = null as unknown as boolean;
      }).not.toThrow();
    });
  });

  describe("numeric range validation", () => {
    it("should accept numbers within range", () => {
      const user = createValidatedObject(userSchema);

      expect(() => {
        user.age = 0;
      }).not.toThrow();

      expect(() => {
        user.age = 150;
      }).not.toThrow();

      expect(() => {
        user.age = 25;
      }).not.toThrow();
    });

    it("should reject numbers below min", () => {
      const user = createValidatedObject(userSchema);

      expect(() => {
        user.age = -1;
      }).toThrow(/min/i);
    });

    it("should reject numbers above max", () => {
      const user = createValidatedObject(userSchema);

      expect(() => {
        user.age = 200;
      }).toThrow(/max/i);
    });
  });

  describe("string length validation", () => {
    it("should accept strings within length bounds", () => {
      const user = createValidatedObject(userSchema);

      expect(() => {
        user.name = "A";
      }).not.toThrow();

      expect(() => {
        user.name = "A".repeat(50);
      }).not.toThrow();
    });

    it("should reject strings below minLength", () => {
      const user = createValidatedObject(userSchema);

      expect(() => {
        user.name = "";
      }).toThrow(/minLength/i);
    });

    it("should reject strings above maxLength", () => {
      const user = createValidatedObject(userSchema);

      expect(() => {
        user.name = "A".repeat(51);
      }).toThrow(/maxLength/i);
    });
  });

  describe("initial values", () => {
    it("should accept initial values", () => {
      const user = createValidatedObject(userSchema, {
        name: "Bob",
        age: 25,
      });

      expect(user.name).toBe("Bob");
      expect(user.age).toBe(25);
    });
  });

  describe("property access", () => {
    it("should return undefined for unset properties", () => {
      const user = createValidatedObject(userSchema);
      expect(user.email).toBeUndefined();
    });

    it("should support 'in' operator for schema properties", () => {
      const user = createValidatedObject(userSchema, { name: "Test" });
      expect("name" in user).toBe(true);
    });

    it("should report schema-defined properties with 'in' operator", () => {
      const user = createValidatedObject(userSchema);
      // Even if not set, the property is defined in the schema
      expect("name" in user).toBe(true);
      expect("age" in user).toBe(true);
    });

    it("should return false for 'in' on non-schema properties", () => {
      const user = createValidatedObject(userSchema);
      expect("nonExistent" in user).toBe(false);
    });
  });
});

describe("createReadonly", () => {
  it("should allow reading properties", () => {
    const obj = createReadonly({ name: "Alice", age: 30 });

    expect(obj.name).toBe("Alice");
    expect(obj.age).toBe(30);
  });

  it("should throw on property assignment", () => {
    const obj = createReadonly({ name: "Alice" });

    expect(() => {
      (obj as Record<string, unknown>).name = "Bob";
    }).toThrow(/readonly/);
  });

  it("should throw on property deletion", () => {
    const obj = createReadonly({ name: "Alice" });

    expect(() => {
      delete (obj as Record<string, unknown>).name;
    }).toThrow(/readonly/);
  });

  it("should correctly access properties using Reflect", () => {
    const base = { x: 10, y: 20 };
    const readonly = createReadonly(base);

    expect(readonly.x).toBe(10);
    expect(readonly.y).toBe(20);
  });
});
