# Solution: Parallel Routes

## The Bug

Three related issues:

1. **`resolveSlot` ignores loading/error states:** It always returns `slot.content`, even when `slot.loading` or `slot.error` is set.

2. **`getSlotContent` crashes on missing slots:** Accessing `slots[name].content` throws a TypeError when `slots[name]` is undefined.

3. **`renderLayout` bypasses `resolveSlot`:** It reads `slot.content` directly instead of using the resolution function that should handle loading/error precedence.

## The Fix

```ts
export function resolveSlot(slot: RouteSlot): string {
  if (slot.error) return slot.error;   // error takes highest priority
  if (slot.loading) return slot.loading; // loading next
  return slot.content;                   // content is the default
}

export function getSlotContent(slots: Record<string, RouteSlot>, name: string): string {
  const slot = slots[name];
  if (!slot) return "";   // safe default for unmatched routes
  return resolveSlot(slot);
}
```

And in `renderLayout`, use `resolveSlot` instead of direct `.content` access.

## Key Takeaway

Next.js parallel routes (`@slot` folders) allow rendering multiple independent page segments simultaneously. Each slot can have its own `loading.tsx`, `error.tsx`, and `default.tsx`. If a slot is not defined for the current route, Next.js uses the `default.tsx` fallback. Without it, navigation to an unmatched route triggers a 404. This exercise models that same resolution logic: check error first, then loading, then content, with a safe default for missing slots.

## Further Reading

- [Parallel Routes](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes)
- [default.js convention](https://nextjs.org/docs/app/api-reference/file-conventions/default)

## Interview Context

Parallel routes are a Next.js 13+ feature that interviewers ask about to gauge your understanding of advanced routing. Key points: slots are independent, each can have its own loading/error UI, unmatched slots need a default export, and soft navigation preserves slot state while hard navigation uses defaults.
