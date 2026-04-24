# Hint 3 (Strong)

```tsx
// Fix 1: Row cleanup
useEffect(() => {
  const element = rowRef.current;
  if (!element) return;
  const handler = () => { if (onVisible) onVisible(index); };
  element.addEventListener("mouseenter", handler);
  return () => element.removeEventListener("mouseenter", handler);
}, [index, onVisible]);

// Fix 2: Passive scroll
container.addEventListener("scroll", handleScroll, { passive: true });

// Fix 3: Batch reads then writes
const heights: { element: HTMLElement; height: number }[] = [];
rows.forEach((row) => {
  heights.push({ element: row as HTMLElement, height: (row as HTMLElement).offsetHeight });
});
heights.forEach(({ element, height }, i) => {
  rowHeightsRef.current.set(i, height);
  element.style.minHeight = `${itemHeight}px`;
});
```
