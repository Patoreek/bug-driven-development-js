import { calculateOrder, getTier, applyDiscount, calculateTax } from "../PricingCalculator";

// BUG: These tests over-mock the internal functions, so they end up testing
// the mock's return values instead of the actual business logic.
// If the real implementation has a bug, these tests won't catch it.

vi.mock("../PricingCalculator", async () => {
  const actual = await vi.importActual<typeof import("../PricingCalculator")>("../PricingCalculator");
  return {
    ...actual,
    getTier: vi.fn().mockReturnValue({
      name: "Standard",
      minQuantity: 1,
      maxQuantity: 9,
      pricePerUnit: 29.99,
    }),
    applyDiscount: vi.fn().mockReturnValue(0),
    calculateTax: vi.fn().mockReturnValue(24.0),
  };
});

describe("PricingCalculator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should calculate order for standard tier", () => {
    // BUG: getTier is mocked to always return Standard tier
    // so this test passes even if the real tier logic is broken
    const result = calculateOrder(5);

    expect(result.tierName).toBe("Standard");
    expect(result.subtotal).toBe(149.95);
  });

  it("should calculate order for bulk tier", () => {
    // BUG: Still returns Standard tier from mock! This test
    // appears to test bulk pricing but actually tests the mock
    vi.mocked(getTier).mockReturnValue({
      name: "Bulk",
      minQuantity: 10,
      maxQuantity: 49,
      pricePerUnit: 24.99,
    });

    const result = calculateOrder(15);

    expect(result.tierName).toBe("Bulk");
    // BUG: Tax is from the mock (24.0), not a real calculation
    expect(result.tax).toBe(24.0);
  });

  it("should apply discount correctly", () => {
    // BUG: applyDiscount is mocked, so this tests the mock return value
    vi.mocked(applyDiscount).mockReturnValue(30.0);

    const result = calculateOrder(5);

    expect(result.discount).toBe(30.0);
  });

  it("should calculate tax", () => {
    // BUG: calculateTax is mocked, returning a hardcoded value
    const result = calculateOrder(5);

    expect(result.tax).toBe(24.0);
  });

  it("should throw for zero quantity", () => {
    expect(() => calculateOrder(0)).toThrow("Quantity must be positive");
  });
});
