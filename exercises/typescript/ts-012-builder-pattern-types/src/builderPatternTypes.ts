// BUG: Type-safe builder pattern with incorrect generic tracking

// BUG 1: The Config type tracks which fields have been set,
// but the builder methods don't update the tracking type.
// After calling .host("localhost"), the type should reflect
// that "host" has been set, but it doesn't.
type ConfigFields = {
  host: string;
  port: number;
  database: string;
  ssl: boolean;
};

type ConfigState = {
  [K in keyof ConfigFields]?: true;
};

// BUG 2: The builder always returns the same type regardless of
// which methods have been called. It should progressively narrow
// the type to track which fields are set.
export class QueryBuilder<State extends ConfigState = {}> {
  private config: Partial<ConfigFields> = {};

  host(value: string): QueryBuilder<State> {
    this.config.host = value;
    return this as any;
  }

  port(value: number): QueryBuilder<State> {
    this.config.port = value;
    return this as any;
  }

  database(value: string): QueryBuilder<State> {
    this.config.database = value;
    return this as any;
  }

  ssl(value: boolean): QueryBuilder<State> {
    this.config.ssl = value;
    return this as any;
  }

  // BUG 3: The build method should only be callable when all required
  // fields (host, port, database) have been set. Currently it accepts
  // any state, so you can call .build() without setting anything.
  build(): ConfigFields {
    if (!this.config.host || !this.config.port || !this.config.database) {
      throw new Error("Missing required fields");
    }
    return {
      host: this.config.host,
      port: this.config.port,
      database: this.config.database,
      ssl: this.config.ssl ?? false,
    };
  }

  getConfig(): Partial<ConfigFields> {
    return { ...this.config };
  }
}

// BUG 4: The RequiredFields type should check if all required keys
// are present in the state, but the conditional type logic is inverted.
type RequiredKeys = "host" | "port" | "database";

export type HasAllRequired<State extends ConfigState> =
  RequiredKeys extends keyof State ? false : true;

// BUG 5: The factory function returns a plain QueryBuilder
// without proper type parameter initialization.
export function createQueryBuilder(): QueryBuilder {
  return new QueryBuilder();
}

// Type-level assertion helpers
export type Expect<T extends true> = T;
export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2)
  ? true
  : false;
