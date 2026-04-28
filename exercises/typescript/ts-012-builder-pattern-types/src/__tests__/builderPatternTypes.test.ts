import { describe, it, expect } from "vitest";
import {
  QueryBuilder,
  type HasAllRequired,
  type Expect,
  type Equal,
  createQueryBuilder,
} from "../builderPatternTypes";

describe("QueryBuilder - progressive type state tracking", () => {
  it("host() updates the state type to include host", () => {
    const builder = createQueryBuilder().host("localhost");
    type State = typeof builder extends QueryBuilder<infer S> ? S : never;
    const check: Expect<Equal<State, { host: true }>> = true;
    expect(check).toBe(true);
  });

  it("chaining host().port() updates state to include both", () => {
    const builder = createQueryBuilder().host("localhost").port(5432);
    type State = typeof builder extends QueryBuilder<infer S> ? S : never;
    const check: Expect<Equal<State, { host: true } & { port: true }>> = true;
    expect(check).toBe(true);
  });

  it("chaining all three required fields includes all in state", () => {
    const builder = createQueryBuilder()
      .host("localhost")
      .port(5432)
      .database("mydb");
    type State = typeof builder extends QueryBuilder<infer S> ? S : never;
    const check: Expect<
      Equal<State, { host: true } & { port: true } & { database: true }>
    > = true;
    expect(check).toBe(true);
  });

  it("getConfig returns partial config at any stage", () => {
    const builder = createQueryBuilder().host("localhost");
    const config = builder.getConfig();
    expect(config).toEqual({ host: "localhost" });
  });
});

describe("HasAllRequired - type-level completeness check", () => {
  it("returns true when all required fields are present", () => {
    type Result = HasAllRequired<{ host: true; port: true; database: true }>;
    const check: Expect<Equal<Result, true>> = true;
    expect(check).toBe(true);
  });

  it("returns true when required fields plus optional are present", () => {
    type Result = HasAllRequired<{ host: true; port: true; database: true; ssl: true }>;
    const check: Expect<Equal<Result, true>> = true;
    expect(check).toBe(true);
  });

  it("returns false when some required fields are missing", () => {
    type Result = HasAllRequired<{ host: true; port: true }>;
    const check: Expect<Equal<Result, false>> = true;
    expect(check).toBe(true);
  });

  it("returns false for empty state", () => {
    type Result = HasAllRequired<{}>;
    const check: Expect<Equal<Result, false>> = true;
    expect(check).toBe(true);
  });
});

describe("QueryBuilder.build() - requires all fields", () => {
  it("succeeds when all required fields are set", () => {
    const result = createQueryBuilder()
      .host("localhost")
      .port(5432)
      .database("mydb")
      .build();

    expect(result).toEqual({
      host: "localhost",
      port: 5432,
      database: "mydb",
      ssl: false,
    });
  });

  it("includes ssl when set", () => {
    const result = createQueryBuilder()
      .host("localhost")
      .port(5432)
      .database("mydb")
      .ssl(true)
      .build();

    expect(result).toEqual({
      host: "localhost",
      port: 5432,
      database: "mydb",
      ssl: true,
    });
  });

  it("works regardless of method call order", () => {
    const result = createQueryBuilder()
      .database("mydb")
      .port(5432)
      .host("localhost")
      .build();

    expect(result).toEqual({
      host: "localhost",
      port: 5432,
      database: "mydb",
      ssl: false,
    });
  });
});

describe("createQueryBuilder - initializes with empty state", () => {
  it("returns a builder with empty state", () => {
    const builder = createQueryBuilder();
    type State = typeof builder extends QueryBuilder<infer S> ? S : never;
    const check: Expect<Equal<State, {}>> = true;
    expect(check).toBe(true);
  });
});
