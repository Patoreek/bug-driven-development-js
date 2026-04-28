import { describe, it, expect } from "vitest";
import {
  type EventName,
  type CSSProperty,
  type PathParam,
  type DotPath,
  type Split,
  type Expect,
  type Equal,
  toEventName,
  camelToKebab,
  extractPathParams,
  splitString,
} from "../templateLiteralTypes";

describe("EventName - capitalize event handler names", () => {
  it("capitalizes a single event name", () => {
    type Result = EventName<"click">;
    const check: Expect<Equal<Result, "onClick">> = true;
    expect(check).toBe(true);
  });

  it("capitalizes multiple event names via union", () => {
    type Result = EventName<"click" | "hover">;
    const check: Expect<Equal<Result, "onClick" | "onHover">> = true;
    expect(check).toBe(true);
  });

  it("capitalizes multi-word events", () => {
    type Result = EventName<"mouseDown">;
    const check: Expect<Equal<Result, "onMouseDown">> = true;
    expect(check).toBe(true);
  });

  it("runtime: produces correct event name", () => {
    expect(toEventName("click")).toBe("onClick");
    expect(toEventName("hover")).toBe("onHover");
  });
});

describe("CSSProperty - camelCase to kebab-case", () => {
  it("converts single uppercase letter", () => {
    type Result = CSSProperty<"fontSize">;
    const check: Expect<Equal<Result, "font-size">> = true;
    expect(check).toBe(true);
  });

  it("converts multiple uppercase letters", () => {
    type Result = CSSProperty<"borderTopWidth">;
    const check: Expect<Equal<Result, "border-top-width">> = true;
    expect(check).toBe(true);
  });

  it("leaves all-lowercase unchanged", () => {
    type Result = CSSProperty<"margin">;
    const check: Expect<Equal<Result, "margin">> = true;
    expect(check).toBe(true);
  });

  it("runtime: converts camelCase to kebab-case", () => {
    expect(camelToKebab("fontSize")).toBe("font-size");
    expect(camelToKebab("borderTopWidth")).toBe("border-top-width");
    expect(camelToKebab("margin")).toBe("margin");
  });
});

describe("PathParam - extract route parameters", () => {
  it("extracts a single parameter", () => {
    type Result = PathParam<"/users/:id">;
    const check: Expect<Equal<Result, "id">> = true;
    expect(check).toBe(true);
  });

  it("extracts multiple parameters", () => {
    type Result = PathParam<"/users/:id/posts/:postId">;
    const check: Expect<Equal<Result, "id" | "postId">> = true;
    expect(check).toBe(true);
  });

  it("returns never for paths with no parameters", () => {
    type Result = PathParam<"/users/all">;
    const check: Expect<Equal<Result, never>> = true;
    expect(check).toBe(true);
  });

  it("runtime: extracts parameters from path string", () => {
    expect(extractPathParams("/users/:id/posts/:postId")).toEqual(["id", "postId"]);
    expect(extractPathParams("/users/all")).toEqual([]);
  });
});

describe("DotPath - nested object dot notation paths", () => {
  it("produces dot paths for nested object", () => {
    type Obj = { user: { name: string; age: number } };
    type Result = DotPath<Obj>;
    type Expected = "user" | "user.name" | "user.age";
    const check: Expect<Equal<Result, Expected>> = true;
    expect(check).toBe(true);
  });

  it("produces simple keys for flat object", () => {
    type Obj = { name: string; age: number };
    type Result = DotPath<Obj>;
    type Expected = "name" | "age";
    const check: Expect<Equal<Result, Expected>> = true;
    expect(check).toBe(true);
  });

  it("handles deeply nested objects", () => {
    type Obj = { a: { b: { c: string } } };
    type Result = DotPath<Obj>;
    type Expected = "a" | "a.b" | "a.b.c";
    const check: Expect<Equal<Result, Expected>> = true;
    expect(check).toBe(true);
  });
});

describe("Split - split string by delimiter", () => {
  it("splits a dot-separated string", () => {
    type Result = Split<"a.b.c", ".">;
    const check: Expect<Equal<Result, ["a", "b", "c"]>> = true;
    expect(check).toBe(true);
  });

  it("returns single-element tuple for no delimiter", () => {
    type Result = Split<"hello", ".">;
    const check: Expect<Equal<Result, ["hello"]>> = true;
    expect(check).toBe(true);
  });

  it("splits slash-separated paths", () => {
    type Result = Split<"users/posts/comments", "/">;
    const check: Expect<Equal<Result, ["users", "posts", "comments"]>> = true;
    expect(check).toBe(true);
  });

  it("runtime: splits strings correctly", () => {
    expect(splitString("a.b.c", ".")).toEqual(["a", "b", "c"]);
    expect(splitString("hello", ".")).toEqual(["hello"]);
  });
});
