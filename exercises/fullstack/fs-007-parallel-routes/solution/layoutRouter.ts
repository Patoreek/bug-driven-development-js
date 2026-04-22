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

// FIX: Handle missing slots with defaults, include loading/error states
export function renderLayout(config: LayoutConfig): string {
  const slotNames = Object.keys(config.slots);
  const parts: string[] = [];

  parts.push(`<main>${config.children}</main>`);

  for (const name of slotNames) {
    const resolved = resolveSlot(config.slots[name]);
    parts.push(`<section data-slot="${name}">${resolved}</section>`);
  }

  return parts.join("\n");
}

// FIX: Handle loading and error states for individual slots
export function resolveSlot(slot: RouteSlot): string {
  if (slot.error) {
    return slot.error;
  }
  if (slot.loading) {
    return slot.loading;
  }
  return slot.content;
}

// FIX: Return a default for unmatched parallel routes instead of crashing
export function getSlotContent(
  slots: Record<string, RouteSlot>,
  name: string
): string {
  const slot = slots[name];
  if (!slot) {
    return "";
  }
  return resolveSlot(slot);
}
