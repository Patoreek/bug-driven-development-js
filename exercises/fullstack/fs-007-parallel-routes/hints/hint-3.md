# Hint 3 (Strong)

```ts
export function resolveSlot(slot: RouteSlot): string {
  if (slot.error) return slot.error;
  if (slot.loading) return slot.loading;
  return slot.content;
}

export function getSlotContent(slots: Record<string, RouteSlot>, name: string): string {
  const slot = slots[name];
  if (!slot) return "";
  return resolveSlot(slot);
}
```

In `renderLayout`, replace `slot.content` with `resolveSlot(config.slots[name])`.
