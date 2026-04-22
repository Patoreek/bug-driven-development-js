import { useState, type ReactNode } from "react";

// This accordion works, but it's tightly coupled through prop drilling.
// The tests expect a compound component API using context.
// Refactor to: <Accordion>, <Accordion.Item>, <Accordion.Header>, <Accordion.Content>

interface AccordionContentInnerProps {
  isExpanded: boolean;
  children: ReactNode;
}

function AccordionContentInner({ isExpanded, children }: AccordionContentInnerProps) {
  if (!isExpanded) return null;
  return (
    <div role="region" data-testid="accordion-content">
      {children}
    </div>
  );
}

interface AccordionHeaderInnerProps {
  isExpanded: boolean;
  onToggle: () => void;
  children: ReactNode;
}

function AccordionHeaderInner({ isExpanded, onToggle, children }: AccordionHeaderInnerProps) {
  return (
    <button
      onClick={onToggle}
      aria-expanded={isExpanded}
      data-testid="accordion-header"
    >
      {children}
    </button>
  );
}

interface AccordionItemInnerProps {
  itemId: string;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  children: ReactNode;
}

function AccordionItemInner({
  itemId,
  isExpanded,
  onToggle,
  children,
}: AccordionItemInnerProps) {
  // This component has to manually thread props to its children.
  // In a real app, children would be AccordionHeader and AccordionContent,
  // but we can't pass props to arbitrary children without cloneElement hacks.

  // For the buggy version, we just render children as-is (breaking the tests).
  return (
    <div data-testid={`accordion-item-${itemId}`}>
      {children}
    </div>
  );
}

interface AccordionProps {
  children: ReactNode;
  allowMultiple?: boolean;
}

export function Accordion({ children }: AccordionProps) {
  // State is here but there's no way for deeply nested children
  // to access it without prop drilling or context
  const [expandedItems] = useState<Set<string>>(new Set());

  // The toggle function exists but isn't accessible to sub-components
  const _toggleItem = (_id: string) => {
    // This is dead code in the buggy version since children
    // can't access it
    void expandedItems;
  };
  void _toggleItem;

  return <div data-testid="accordion">{children}</div>;
}

// Attach sub-components as static properties (but they're broken without context)
Accordion.Item = AccordionItemInner;
Accordion.Header = AccordionHeaderInner;
Accordion.Content = AccordionContentInner;
