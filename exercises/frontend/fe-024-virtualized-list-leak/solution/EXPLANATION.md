# Solution: Virtualized List — Memory Leaks and Layout Thrashing

## Bug 1: Memory Leak (Missing Event Listener Cleanup)

### Why

When a Row unmounts (scrolls out of view), React removes its DOM node. But the `mouseenter` event listener attached in `useEffect` is never removed. The listener closure holds a reference to the DOM node and React component, preventing garbage collection.

```diff
  useEffect(() => {
    const element = rowRef.current;
    if (!element) return;
    const handler = () => { if (onVisible) onVisible(index); };
    element.addEventListener("mouseenter", handler);
-   // No cleanup!
+   return () => element.removeEventListener("mouseenter", handler);
  }, [index, onVisible]);
```

Over thousands of mount/unmount cycles during scrolling, this leaks megabytes of memory.

## Bug 2: Non-Passive Scroll Listener

### Why

By default, the browser assumes a scroll event handler might call `preventDefault()`, so it waits for the handler to complete before scrolling. This blocks the compositor thread and causes visible jank, especially on touch devices.

```diff
- container.addEventListener("scroll", handleScroll);
+ container.addEventListener("scroll", handleScroll, { passive: true });
```

`{ passive: true }` tells the browser "this handler will never call preventDefault()", allowing scroll to happen on the compositor thread in parallel.

## Bug 3: Layout Thrashing

### Why

Reading `offsetHeight` forces the browser to calculate layout. Writing `style.minHeight` invalidates that layout. When these alternate in a loop, each read triggers a **forced synchronous layout** (reflow):

```
read -> write -> read (REFLOW!) -> write -> read (REFLOW!) -> ...
```

### Fix: Batch reads, then batch writes

```tsx
// BATCH READ
const heights = [];
rows.forEach((row) => {
  heights.push({ element: row, height: row.offsetHeight });
});

// BATCH WRITE
heights.forEach(({ element, height }, i) => {
  rowHeightsRef.current.set(i, height);
  element.style.minHeight = `${itemHeight}px`;
});
```

Now there's only **one** layout calculation (during the read phase), and all writes happen without triggering additional reflows.

## Documentation

- [useEffect cleanup](https://react.dev/reference/react/useEffect#connecting-to-an-external-system)
- [Passive event listeners (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#using_passive_listeners)
- [Avoid layout thrashing (web.dev)](https://web.dev/avoid-large-complex-layouts-and-layout-thrashing/)
- [What forces layout/reflow](https://gist.github.com/paulirish/5d52fb081b3570c81e3a)

## Common Variations

- IntersectionObserver not being disconnected on unmount
- ResizeObserver leaking after component unmount
- WebSocket connections not closed in cleanup
- `requestAnimationFrame` IDs not cancelled

## Interview Context

This is a senior-level performance question that tests:
- Understanding of browser rendering pipeline (layout, paint, composite)
- Knowing which DOM properties force layout (the "reflow triggers" list)
- Event listener lifecycle management in React
- Passive listeners and their impact on scroll performance
- Memory profiling awareness
