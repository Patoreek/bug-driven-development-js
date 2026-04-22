import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

// --- Accordion Context ---

interface AccordionContextValue {
  expandedItems: Set<string>;
  toggleItem: (id: string) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion sub-components must be used within <Accordion>");
  }
  return context;
}

// --- Item Context ---

interface ItemContextValue {
  itemId: string;
  isExpanded: boolean;
}

const ItemContext = createContext<ItemContextValue | null>(null);

function useItemContext() {
  const context = useContext(ItemContext);
  if (!context) {
    throw new Error("Accordion.Header and Accordion.Content must be used within <Accordion.Item>");
  }
  return context;
}

// --- Sub-components ---

interface AccordionItemProps {
  itemId: string;
  children: ReactNode;
}

function AccordionItem({ itemId, children }: AccordionItemProps) {
  const { expandedItems } = useAccordionContext();
  const isExpanded = expandedItems.has(itemId);

  return (
    <ItemContext.Provider value={{ itemId, isExpanded }}>
      <div data-testid={`accordion-item-${itemId}`}>{children}</div>
    </ItemContext.Provider>
  );
}

interface AccordionHeaderProps {
  children: ReactNode;
}

function AccordionHeader({ children }: AccordionHeaderProps) {
  const { toggleItem } = useAccordionContext();
  const { itemId, isExpanded } = useItemContext();

  return (
    <button
      onClick={() => toggleItem(itemId)}
      aria-expanded={isExpanded}
      data-testid="accordion-header"
    >
      {children}
    </button>
  );
}

interface AccordionContentProps {
  children: ReactNode;
}

function AccordionContent({ children }: AccordionContentProps) {
  const { isExpanded } = useItemContext();

  if (!isExpanded) return null;

  return (
    <div role="region" data-testid="accordion-content">
      {children}
    </div>
  );
}

// --- Main Accordion ---

interface AccordionProps {
  children: ReactNode;
  allowMultiple?: boolean;
}

export function Accordion({ children, allowMultiple = false }: AccordionProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItem = useCallback(
    (id: string) => {
      setExpandedItems((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          if (!allowMultiple) {
            next.clear();
          }
          next.add(id);
        }
        return next;
      });
    },
    [allowMultiple]
  );

  return (
    <AccordionContext.Provider value={{ expandedItems, toggleItem }}>
      <div data-testid="accordion">{children}</div>
    </AccordionContext.Provider>
  );
}

// Attach sub-components as static properties for the compound component API
Accordion.Item = AccordionItem;
Accordion.Header = AccordionHeader;
Accordion.Content = AccordionContent;
