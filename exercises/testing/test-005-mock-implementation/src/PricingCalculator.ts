export interface PricingTier {
  name: string;
  minQuantity: number;
  maxQuantity: number;
  pricePerUnit: number;
}

export interface Discount {
  code: string;
  percentage: number;
  minOrderTotal: number;
}

export interface OrderSummary {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  tierName: string;
}

const PRICING_TIERS: PricingTier[] = [
  { name: "Standard", minQuantity: 1, maxQuantity: 9, pricePerUnit: 29.99 },
  { name: "Bulk", minQuantity: 10, maxQuantity: 49, pricePerUnit: 24.99 },
  { name: "Enterprise", minQuantity: 50, maxQuantity: Infinity, pricePerUnit: 19.99 },
];

const TAX_RATE = 0.08;

export function getTier(quantity: number): PricingTier {
  const tier = PRICING_TIERS.find(
    (t) => quantity >= t.minQuantity && quantity <= t.maxQuantity
  );
  if (!tier) throw new Error(`No pricing tier for quantity: ${quantity}`);
  return tier;
}

export function applyDiscount(
  subtotal: number,
  discount: Discount | null
): number {
  if (!discount) return 0;
  if (subtotal < discount.minOrderTotal) return 0;
  return Math.round(subtotal * (discount.percentage / 100) * 100) / 100;
}

export function calculateTax(amount: number): number {
  return Math.round(amount * TAX_RATE * 100) / 100;
}

export function calculateOrder(
  quantity: number,
  discount: Discount | null = null
): OrderSummary {
  if (quantity <= 0) throw new Error("Quantity must be positive");

  const tier = getTier(quantity);
  const subtotal = Math.round(quantity * tier.pricePerUnit * 100) / 100;
  const discountAmount = applyDiscount(subtotal, discount);
  const taxableAmount = subtotal - discountAmount;
  const tax = calculateTax(taxableAmount);
  const total = Math.round((taxableAmount + tax) * 100) / 100;

  return {
    subtotal,
    discount: discountAmount,
    tax,
    total,
    tierName: tier.name,
  };
}
