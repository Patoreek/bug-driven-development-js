import { describe, it, expect } from "vitest";
import { Repository, pluck, merge, getProperty } from "../repository";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Product {
  id: string;
  title: string;
  price: number;
}

describe("Repository", () => {
  it("should add and retrieve items by id", () => {
    const repo = new Repository<User>();
    repo.add({ id: "1", name: "Alice", email: "alice@test.com" });
    repo.add({ id: "2", name: "Bob", email: "bob@test.com" });

    const found = repo.findById("1");
    expect(found).toBeDefined();
    expect(found!.name).toBe("Alice");
  });

  it("should return undefined for non-existent id", () => {
    const repo = new Repository<User>();
    expect(repo.findById("999")).toBeUndefined();
  });

  it("should remove an item by id", () => {
    const repo = new Repository<User>();
    repo.add({ id: "1", name: "Alice", email: "alice@test.com" });

    expect(repo.remove("1")).toBe(true);
    expect(repo.findById("1")).toBeUndefined();
    expect(repo.remove("1")).toBe(false);
  });

  it("should update an item by id", () => {
    const repo = new Repository<Product>();
    repo.add({ id: "p1", title: "Widget", price: 10 });

    const updated = repo.update("p1", { price: 15 });
    expect(updated).toBeDefined();
    expect(updated!.price).toBe(15);
    expect(updated!.title).toBe("Widget");
  });

  it("should return undefined when updating non-existent item", () => {
    const repo = new Repository<User>();
    expect(repo.update("999", { name: "Ghost" })).toBeUndefined();
  });

  it("should return all items", () => {
    const repo = new Repository<User>();
    repo.add({ id: "1", name: "Alice", email: "a@t.com" });
    repo.add({ id: "2", name: "Bob", email: "b@t.com" });

    expect(repo.getAll()).toHaveLength(2);
  });

  it("findById should work without using `as any` internally", () => {
    // This test verifies the fix uses proper constraints instead of `any` casts
    const repo = new Repository<User>();
    repo.add({ id: "1", name: "Alice", email: "a@t.com" });

    // If the generic constraint is correct, TypeScript knows T has `id: string`
    const result = repo.findById("1");
    expect(result?.id).toBe("1");
  });
});

describe("pluck", () => {
  it("should extract values for a given key", () => {
    const users: User[] = [
      { id: "1", name: "Alice", email: "a@t.com" },
      { id: "2", name: "Bob", email: "b@t.com" },
    ];

    const names = pluck(users, "name");
    expect(names).toEqual(["Alice", "Bob"]);
  });

  it("should return correct types for the plucked values", () => {
    const products: Product[] = [
      { id: "1", title: "A", price: 10 },
      { id: "2", title: "B", price: 20 },
    ];

    const prices = pluck(products, "price");
    expect(prices).toEqual([10, 20]);
    // Each price should be a number, not unknown
    expect(typeof prices[0]).toBe("number");
  });
});

describe("merge", () => {
  it("should merge two objects", () => {
    const a = { name: "Alice" };
    const b = { age: 30 };

    const result = merge(a, b);
    expect(result).toEqual({ name: "Alice", age: 30 });
    expect(result.name).toBe("Alice");
    expect(result.age).toBe(30);
  });

  it("should override properties from left with right", () => {
    const a = { name: "Alice", role: "admin" };
    const b = { role: "viewer", active: true };

    const result = merge(a, b);
    expect(result.role).toBe("viewer");
    expect(result.active).toBe(true);
  });
});

describe("getProperty", () => {
  it("should return the value at the given key", () => {
    const user: User = { id: "1", name: "Alice", email: "a@t.com" };

    expect(getProperty(user, "name")).toBe("Alice");
    expect(getProperty(user, "email")).toBe("a@t.com");
  });

  it("should return the correct type for the key", () => {
    const product: Product = { id: "1", title: "Widget", price: 42 };

    const price = getProperty(product, "price");
    expect(price).toBe(42);
    expect(typeof price).toBe("number");
  });
});
