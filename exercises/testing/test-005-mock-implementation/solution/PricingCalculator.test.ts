import { calculateOrder, getTier, applyDiscount, calculateTax } from "../PricingCalculator";

// No mocking of internal functions -- test the real behavior

describe("PricingCalculator", () => {
  describe("getTier", () => {
    it("should return Standard tier for small quantities", () => {
      const tier = getTier(5);
      expect(tier.name).toBe("Standard");
      expect(tier.pricePerUnit).toBe(29.99);
    });

    it("should return Bulk tier for medium quantities", () => {
      const tier = getTier(25);
      expect(tier.name).toBe("Bulk");
      expect(tier.pricePerUnit).toBe(24.99);
    });

    it("should return Enterprise tier for large quantities", () => {
      const tier = getTier(100);
      expect(tier.name).toBe("Enterprise");
      expect(tier.pricePerUnit).toBe(19.99);
    });
  });

  describe("applyDiscount", () => {
    it("should return 0 when no discount is provided", () => {
      expect(applyDiscount(100, null)).toBe(0);
    });

    it("should return 0 when subtotal is below minimum", () => {
      const discount = { code: "SAVE10", percentage: 10, minOrderTotal: 200 };
      expect(applyDiscount(100, discount)).toBe(0);
    });

    it("should apply percentage discount when subtotal meets minimum", () => {
      const discount = { code: "SAVE10", percentage: 10, minOrderTotal: 50 };
      expect(applyDiscount(100, discount)).toBe(10);
    });
  });

  describe("calculateTax", () => {
    it("should calculate 8% tax", () => {
      expect(calculateTax(100)).toBe(8);
    });

    it("should round to two decimal places", () => {
      expect(calculateTax(33.33)).toBe(2.67);
    });
  });

  describe("calculateOrder", () => {
    it("should calculate order for standard tier", () => {
      const result = calculateOrder(5);

      expect(result.tierName).toBe("Standard");
      expect(result.subtotal).toBe(149.95);
      expect(result.discount).toBe(0);
      expect(result.tax).toBe(12);
      expect(result.total).toBe(161.95);
    });

    it("should calculate order for bulk tier", () => {
      const result = calculateOrder(15);

      expect(result.tierName).toBe("Bulk");
      expect(result.subtotal).toBe(374.85);
      expect(result.tax).toBe(29.99);
      expect(result.total).toBe(404.84);
    });

    it("should calculate order for enterprise tier", () => {
      const result = calculateOrder(100);

      expect(result.tierName).toBe("Enterprise");
      expect(result.subtotal).toBe(1999);
      expect(result.tax).toBe(159.92);
      expect(result.total).toBe(2158.92);
    });

    it("should apply discount to order", () => {
      const discount = { code: "SAVE10", percentage: 10, minOrderTotal: 100 };
      const result = calculateOrder(5, discount);

      expect(result.subtotal).toBe(149.95);
      expect(result.discount).toBe(15);
      expect(result.tax).toBe(10.8);
      expect(result.total).toBe(145.75);
    });

    it("should throw for zero quantity", () => {
      expect(() => calculateOrder(0)).toThrow("Quantity must be positive");
    });

    it("should throw for negative quantity", () => {
      expect(() => calculateOrder(-3)).toThrow("Quantity must be positive");
    });
  });
});
