import { useState, useEffect, useRef, useCallback } from "react";

interface VirtualListProps {
  items: string[];
  itemHeight: number;
  containerHeight: number;
}

interface RowProps {
  content: string;
  index: number;
  style: React.CSSProperties;
  onVisible?: (index: number) => void;
}

// BUG 1: Row component attaches event listeners but never cleans them up.
// When the row scrolls out of view and is removed from the DOM,
// the listener persists in memory (referencing the removed DOM node).
export function Row({ content, index, style, onVisible }: RowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = rowRef.current;
    if (!element) return;

    // Attaching a listener to track visibility — but no cleanup!
    const handleIntersect = () => {
      if (onVisible) onVisible(index);
    };

    element.addEventListener("mouseenter", handleIntersect);
    // BUG: Missing cleanup — when this row unmounts, the listener leaks
  }, [index, onVisible]);

  return (
    <div
      ref={rowRef}
      data-testid={`row-${index}`}
      style={style}
      role="listitem"
    >
      {content}
    </div>
  );
}

export function VirtualList({
  items,
  itemHeight,
  containerHeight,
}: VirtualListProps) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const rowHeightsRef = useRef<Map<number, number>>(new Map());

  // BUG 2: Scroll handler is not passive — blocks scrolling on touch devices,
  // and the browser can't optimize scroll performance.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setScrollTop(container.scrollTop);
    };

    // Non-passive scroll listener — hurts performance
    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // BUG 3: Layout thrashing — reads and writes to the DOM interleaved in a loop.
  // Each iteration forces a reflow (reads offsetHeight) then writes (sets style).
  const measureRows = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const rows = container.querySelectorAll('[role="listitem"]');
    rows.forEach((row, i) => {
      // READ — forces layout calculation
      const height = (row as HTMLElement).offsetHeight;
      rowHeightsRef.current.set(i, height);

      // WRITE — invalidates the layout, next read triggers reflow
      (row as HTMLElement).style.minHeight = `${itemHeight}px`;
    });
  }, [itemHeight]);

  useEffect(() => {
    measureRows();
  }, [measureRows, scrollTop]);

  // Calculate visible range
  const startIndex = Math.floor(scrollTop / itemHeight);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount + 1, items.length);
  const totalHeight = items.length * itemHeight;

  const visibleItems = [];
  for (let i = startIndex; i < endIndex; i++) {
    visibleItems.push(
      <Row
        key={i}
        content={items[i]}
        index={i}
        style={{
          position: "absolute",
          top: i * itemHeight,
          height: itemHeight,
          width: "100%",
          boxSizing: "border-box",
        }}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      data-testid="virtual-list-container"
      style={{
        height: containerHeight,
        overflow: "auto",
        position: "relative",
      }}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        {visibleItems}
      </div>
    </div>
  );
}
