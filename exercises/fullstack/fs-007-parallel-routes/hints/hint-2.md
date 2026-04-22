# Hint 2 (Medium)

`resolveSlot` should prioritize states: if `error` is set, return it. If `loading` is set, return it. Otherwise return `content`. `getSlotContent` should check if the slot exists before accessing `.content`. `renderLayout` should call `resolveSlot` instead of directly reading `.content`.
