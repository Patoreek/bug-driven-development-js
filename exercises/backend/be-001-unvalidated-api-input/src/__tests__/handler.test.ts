import { describe, it, expect } from "vitest";
import { handleCreateProduct } from "../handler";

describe("handleCreateProduct", () => {
  it("should return 201 with product data for valid input", async () => {
    const result = await handleCreateProduct({
      name: "Wireless Mouse",
      price: 29.99,
      category: "electronics",
    });

    expect(result.status).toBe(201);
    expect(result.body.product).toBeDefined();
    expect(result.body.product!.name).toBe("Wireless Mouse");
    expect(result.body.product!.price).toBe(29.99);
    expect(result.body.product!.category).toBe("electronics");
    expect(result.body.product!.id).toBeDefined();
  });

  it("should return 400 when name is missing", async () => {
    const result = await handleCreateProduct({
      price: 29.99,
      category: "electronics",
    });

    expect(result.status).toBe(400);
    expect(result.body.error).toBeDefined();
  });

  it("should return 400 when name is an empty string", async () => {
    const result = await handleCreateProduct({
      name: "",
      price: 29.99,
      category: "electronics",
    });

    expect(result.status).toBe(400);
    expect(result.body.error).toBeDefined();
  });

  it("should return 400 when price is negative", async () => {
    const result = await handleCreateProduct({
      name: "Widget",
      price: -5,
      category: "electronics",
    });

    expect(result.status).toBe(400);
    expect(result.body.error).toBeDefined();
  });

  it("should return 400 when price is not a number", async () => {
    const result = await handleCreateProduct({
      name: "Widget",
      price: "not-a-number",
      category: "electronics",
    });

    expect(result.status).toBe(400);
    expect(result.body.error).toBeDefined();
  });

  it("should return 400 when category is missing", async () => {
    const result = await handleCreateProduct({
      name: "Widget",
      price: 10,
    });

    expect(result.status).toBe(400);
    expect(result.body.error).toBeDefined();
  });

  it("should return 400 when body is null or undefined", async () => {
    const result = await handleCreateProduct(null);

    expect(result.status).toBe(400);
    expect(result.body.error).toBeDefined();
  });

  it("should return 400 with errors array describing each field issue", async () => {
    const result = await handleCreateProduct({
      name: "",
      price: -1,
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
    expect(Array.isArray(result.body.errors)).toBe(true);
    expect(result.body.errors!.length).toBeGreaterThanOrEqual(2);
    expect(result.body.errors!.some((e) => e.field === "name")).toBe(true);
  });

  it("should not include product data when validation fails", async () => {
    const result = await handleCreateProduct({});

    expect(result.status).toBe(400);
    expect(result.body.product).toBeUndefined();
  });

  it("should return 400 when price is zero", async () => {
    const result = await handleCreateProduct({
      name: "Free Item",
      price: 0,
      category: "samples",
    });

    expect(result.status).toBe(400);
    expect(result.body.error).toBeDefined();
  });
});
