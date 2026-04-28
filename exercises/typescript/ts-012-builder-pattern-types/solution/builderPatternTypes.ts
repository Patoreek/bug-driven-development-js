// FIX: Type-safe builder pattern with correct generic state tracking

type ConfigFields = {
  host: string;
  port: number;
  database: string;
  ssl: boolean;
};

type ConfigState = {
  [K in keyof ConfigFields]?: true;
};

// FIX 2: Each method returns QueryBuilder with an updated State
// that includes the newly set field. This progressively builds up
// the type to track which fields have been configured.
export class QueryBuilder<State extends ConfigState = {}> {
  private config: Partial<ConfigFields> = {};

  host(value: string): QueryBuilder<State & { host: true }> {
    this.config.host = value;
    return this as any;
  }

  port(value: number): QueryBuilder<State & { port: true }> {
    this.config.port = value;
    return this as any;
  }

  database(value: string): QueryBuilder<State & { database: true }> {
    this.config.database = value;
    return this as any;
  }

  ssl(value: boolean): QueryBuilder<State & { ssl: true }> {
    this.config.ssl = value;
    return this as any;
  }

  // FIX 3: The build method uses a conditional type on `this` to restrict
  // when it can be called. The HasAllRequired check ensures that host,
  // port, and database are all present in State.
  build(this: QueryBuilder<State> & (HasAllRequired<State> extends true ? {} : never)): ConfigFields {
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

// FIX 4: The conditional logic was inverted. When RequiredKeys extends
// keyof State, it means all required keys ARE in the state, so return true.
type RequiredKeys = "host" | "port" | "database";

export type HasAllRequired<State extends ConfigState> =
  RequiredKeys extends keyof State ? true : false;

// FIX 5: Initialize with explicit empty state type parameter.
export function createQueryBuilder(): QueryBuilder<{}> {
  return new QueryBuilder<{}>();
}

// Type-level assertion helpers
export type Expect<T extends true> = T;
export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2)
  ? true
  : false;
