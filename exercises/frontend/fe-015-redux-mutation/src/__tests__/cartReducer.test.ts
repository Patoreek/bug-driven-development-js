import { describe, it, expect } from "vitest";
import { cartReducer, type CartState } from "../cartReducer";

describe("cartReducer", () => {
  const emptyState: CartState = { items: [], total: 0 };

  const stateWithItems: CartState = {
    items: [
      { id: "p1", name: "Widget", price: 10, quantity: 2 },
      { id: "p2", name: "Gadget", price: 25, quantity: 1 },
    ],
    total: 45,
  };

  describe("ADD_ITEM", () => {
    it("adds a new item with quantity 1", () => {
      const result = cartReducer(emptyState, {
        type: "ADD_ITEM",
        payload: { id: "p1", name: "Widget", price: 10 },
      });

      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toEqual({
        id: "p1",
        name: "Widget",
        price: 10,
        quantity: 1,
      });
      expect(result.total).toBe(10);
    });

    it("increments quantity if item already exists", () => {
      const state: CartState = {
        items: [{ id: "p1", name: "Widget", price: 10, quantity: 1 }],
        total: 10,
      };

      const result = cartReducer(state, {
        type: "ADD_ITEM",
        payload: { id: "p1", name: "Widget", price: 10 },
      });

      expect(result.items[0].quantity).toBe(2);
      expect(result.total).toBe(20);
    });

    it("does NOT mutate the original state when adding a new item", () => {
      const original: CartState = { items: [], total: 0 };
      const frozen = JSON.parse(JSON.stringify(original));

      const result = cartReducer(original, {
        type: "ADD_ITEM",
        payload: { id: "p1", name: "Widget", price: 10 },
      });

      // The returned state should be a new reference
      expect(result).not.toBe(original);
      expect(result.items).not.toBe(original.items);
      // Original should be unchanged
      expect(original).toEqual(frozen);
    });

    it("does NOT mutate the original state when incrementing quantity", () => {
      const original: CartState = {
        items: [{ id: "p1", name: "Widget", price: 10, quantity: 1 }],
        total: 10,
      };
      const frozen = JSON.parse(JSON.stringify(original));

      const result = cartReducer(original, {
        type: "ADD_ITEM",
        payload: { id: "p1", name: "Widget", price: 10 },
      });

      expect(result).not.toBe(original);
      expect(result.items).not.toBe(original.items);
      expect(result.items[0]).not.toBe(original.items[0]);
      expect(original).toEqual(frozen);
    });
  });

  describe("REMOVE_ITEM", () => {
    it("removes the specified item", () => {
      const result = cartReducer(stateWithItems, {
        type: "REMOVE_ITEM",
        payload: { id: "p1" },
      });

      expect(result.items).toHaveLength(1);
      expect(result.items[0].id).toBe("p2");
      expect(result.total).toBe(25);
    });

    it("does NOT mutate the original state", () => {
      const original: CartState = {
        items: [
          { id: "p1", name: "Widget", price: 10, quantity: 2 },
          { id: "p2", name: "Gadget", price: 25, quantity: 1 },
        ],
        total: 45,
      };
      const frozen = JSON.parse(JSON.stringify(original));

      const result = cartReducer(original, {
        type: "REMOVE_ITEM",
        payload: { id: "p1" },
      });

      expect(result).not.toBe(original);
      expect(result.items).not.toBe(original.items);
      expect(original).toEqual(frozen);
    });
  });

  describe("UPDATE_QUANTITY", () => {
    it("updates the quantity of an existing item", () => {
      const result = cartReducer(stateWithItems, {
        type: "UPDATE_QUANTITY",
        payload: { id: "p1", quantity: 5 },
      });

      expect(result.items[0].quantity).toBe(5);
      expect(result.total).toBe(75); // 5*10 + 1*25
    });

    it("does NOT mutate the original state", () => {
      const original: CartState = {
        items: [
          { id: "p1", name: "Widget", price: 10, quantity: 2 },
          { id: "p2", name: "Gadget", price: 25, quantity: 1 },
        ],
        total: 45,
      };
      const frozen = JSON.parse(JSON.stringify(original));

      const result = cartReducer(original, {
        type: "UPDATE_QUANTITY",
        payload: { id: "p1", quantity: 5 },
      });

      expect(result).not.toBe(original);
      expect(result.items).not.toBe(original.items);
      expect(result.items[0]).not.toBe(original.items[0]);
      expect(original).toEqual(frozen);
    });
  });

  describe("CLEAR_CART", () => {
    it("clears all items and resets total", () => {
      const result = cartReducer(stateWithItems, { type: "CLEAR_CART" });
      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it("does NOT mutate the original state", () => {
      const original: CartState = {
        items: [{ id: "p1", name: "Widget", price: 10, quantity: 2 }],
        total: 20,
      };
      const frozen = JSON.parse(JSON.stringify(original));

      const result = cartReducer(original, { type: "CLEAR_CART" });

      expect(result).not.toBe(original);
      expect(original).toEqual(frozen);
    });
  });

  describe("unknown action", () => {
    it("returns the current state for unknown actions", () => {
      const result = cartReducer(stateWithItems, {
        type: "UNKNOWN" as never,
      });
      expect(result).toBe(stateWithItems);
    });
  });
});
