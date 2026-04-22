export type RouteSlot = {
  name: string;
  content: string;
  loading?: string;
  error?: string;
};

export type LayoutConfig = {
  slots: Record<string, RouteSlot>;
  children: string;
};

// BUG: Parallel route slots are rendered sequentially and missing slots crash
export function renderLayout(config: LayoutConfig): string {
  const slotNames = Object.keys(config.slots);
  const parts: string[] = [];

  parts.push(`<main>${config.children}</main>`);

  for (const name of slotNames) {
    const slot = config.slots[name];
    // BUG 1: No fallback for missing/undefined slot content
    parts.push(`<section data-slot="${name}">${slot.content}</section>`);
  }

  return parts.join("\n");
}

// BUG 2: Does not handle loading or error states for individual slots
export function resolveSlot(slot: RouteSlot): string {
  return slot.content;
}

// BUG 3: Does not provide a default for unmatched parallel routes
export function getSlotContent(
  slots: Record<string, RouteSlot>,
  name: string
): string {
  const slot = slots[name];
  // Crashes if slot doesn't exist
  return slot.content;
}
