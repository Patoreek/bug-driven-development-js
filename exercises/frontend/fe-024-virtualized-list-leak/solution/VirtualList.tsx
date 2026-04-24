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

// FIX 1: Row component properly cleans up event listeners on unmount
export function Row({ content, index, style, onVisible }: RowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = rowRef.current;
    if (!element) return;

    const handleIntersect = () => {
      if (onVisible) onVisible(index);
    };

    element.addEventListener("mouseenter", handleIntersect);

    // FIX: Clean up on unmount — prevents memory leak when row leaves viewport
    return () => {
      element.removeEventListener("mouseenter", handleIntersect);
    };
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

  // FIX 2: Use passive scroll listener — tells the browser this handler
  // won't call preventDefault(), allowing scroll performance optimizations.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setScrollTop(container.scrollTop);
    };

    // Passive listener — browser can optimize scrolling
    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // FIX 3: Batch DOM reads and writes separately to avoid layout thrashing.
  // First read all heights, then write all styles.
  const measureRows = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const rows = container.querySelectorAll('[role="listitem"]');

    // BATCH READ — all reads first
    const heights: Array<{ element: HTMLElement; height: number }> = [];
    rows.forEach((row) => {
      const element = row as HTMLElement;
      heights.push({ element, height: element.offsetHeight });
    });

    // BATCH WRITE — all writes after reads are done
    heights.forEach(({ element, height }, i) => {
      rowHeightsRef.current.set(i, height);
      element.style.minHeight = `${itemHeight}px`;
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
