import { describe, it, expect } from "vitest";
import {
  type ExtractStrings,
  type ExtractFunctions,
  type NonNullableDeep,
  type IsNever,
  type TypeName,
  type Expect,
  type Equal,
  extractStrings,
  getTypeName,
} from "../conditionalTypes";

// Type-level tests: these cause compile errors if the types are wrong
// We use a trick: assign the type assertion to a variable that's used in a runtime test

describe("ExtractStrings - distributive conditional type", () => {
  it("extracts string members from a union", () => {
    // Type-level: ExtractStrings<string | number | boolean> should be `string`
    type Result = ExtractStrings<string | number | boolean>;
    const check: Expect<Equal<Result, string>> = true;
    expect(check).toBe(true);
  });

  it("returns never for unions with no strings", () => {
    type Result = ExtractStrings<number | boolean>;
    const check: Expect<Equal<Result, never>> = true;
    expect(check).toBe(true);
  });

  it("returns string for just string", () => {
    type Result = ExtractStrings<string>;
    const check: Expect<Equal<Result, string>> = true;
    expect(check).toBe(true);
  });

  it("extracts string literals from a union", () => {
    type Result = ExtractStrings<"hello" | 42 | true>;
    const check: Expect<Equal<Result, "hello">> = true;
    expect(check).toBe(true);
  });

  it("runtime: filters strings from mixed array", () => {
    const mixed = ["hello", 42, "world", true] as (string | number | boolean)[];
    const strings = extractStrings(mixed);
    expect(strings).toEqual(["hello", "world"]);
  });
});

describe("ExtractFunctions - distributive for function types", () => {
  it("extracts function members from a union", () => {
    type Fn = () => void;
    type Result = ExtractFunctions<string | Fn | number>;
    // Should extract just the function type
    const check: Expect<Equal<Result, Fn>> = true;
    expect(check).toBe(true);
  });
});

describe("NonNullableDeep - distributive null removal", () => {
  it("removes null and undefined from a union", () => {
    type Result = NonNullableDeep<string | null | undefined>;
    const check: Expect<Equal<Result, string>> = true;
    expect(check).toBe(true);
  });

  it("removes null from number | null", () => {
    type Result = NonNullableDeep<number | null>;
    const check: Expect<Equal<Result, number>> = true;
    expect(check).toBe(true);
  });

  it("keeps non-nullable types unchanged", () => {
    type Result = NonNullableDeep<string | number>;
    const check: Expect<Equal<Result, string | number>> = true;
    expect(check).toBe(true);
  });

  it("returns never for null | undefined only", () => {
    type Result = NonNullableDeep<null | undefined>;
    const check: Expect<Equal<Result, never>> = true;
    expect(check).toBe(true);
  });
});

describe("IsNever - non-distributive never detection", () => {
  it("returns true for never", () => {
    type Result = IsNever<never>;
    const check: Expect<Equal<Result, true>> = true;
    expect(check).toBe(true);
  });

  it("returns false for string", () => {
    type Result = IsNever<string>;
    const check: Expect<Equal<Result, false>> = true;
    expect(check).toBe(true);
  });

  it("returns false for unions", () => {
    type Result = IsNever<string | number>;
    const check: Expect<Equal<Result, false>> = true;
    expect(check).toBe(true);
  });

  it("returns false for unknown", () => {
    type Result = IsNever<unknown>;
    const check: Expect<Equal<Result, false>> = true;
    expect(check).toBe(true);
  });

  it("returns false for any", () => {
    type Result = IsNever<any>;
    // `any` is special: IsNever<any> should be false
    const check: Expect<Equal<Result, false>> = true;
    expect(check).toBe(true);
  });
});

describe("TypeName - distributive type mapping", () => {
  it("maps string to 'string'", () => {
    type Result = TypeName<string>;
    const check: Expect<Equal<Result, "string">> = true;
    expect(check).toBe(true);
  });

  it("maps number to 'number'", () => {
    type Result = TypeName<number>;
    const check: Expect<Equal<Result, "number">> = true;
    expect(check).toBe(true);
  });

  it("distributes over unions to produce union of names", () => {
    type Result = TypeName<string | number>;
    const check: Expect<Equal<Result, "string" | "number">> = true;
    expect(check).toBe(true);
  });

  it("maps boolean to 'boolean'", () => {
    type Result = TypeName<boolean>;
    const check: Expect<Equal<Result, "boolean">> = true;
    expect(check).toBe(true);
  });

  it("maps null to 'null'", () => {
    type Result = TypeName<null>;
    const check: Expect<Equal<Result, "null">> = true;
    expect(check).toBe(true);
  });

  it("runtime: getTypeName maps values correctly", () => {
    expect(getTypeName("hello")).toBe("string");
    expect(getTypeName(42)).toBe("number");
    expect(getTypeName(true)).toBe("boolean");
    expect(getTypeName(null)).toBe("null");
    expect(getTypeName(undefined)).toBe("undefined");
  });
});
