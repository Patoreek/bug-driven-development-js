Here's the structure you need:

```tsx
const AccordionContext = createContext<{ expandedItems: Set<string>; toggleItem: (id: string) => void } | null>(null);
const ItemContext = createContext<{ itemId: string; isExpanded: boolean } | null>(null);

function Accordion({ children, allowMultiple }) {
  const [expandedItems, setExpandedItems] = useState(new Set());
  const toggleItem = (id) => { /* toggle logic, clear others if !allowMultiple */ };
  return (
    <AccordionContext.Provider value={{ expandedItems, toggleItem }}>
      <div data-testid="accordion">{children}</div>
    </AccordionContext.Provider>
  );
}

function AccordionItem({ itemId, children }) {
  const { expandedItems } = useContext(AccordionContext);
  return (
    <ItemContext.Provider value={{ itemId, isExpanded: expandedItems.has(itemId) }}>
      <div data-testid={`accordion-item-${itemId}`}>{children}</div>
    </ItemContext.Provider>
  );
}

function AccordionHeader({ children }) {
  const { toggleItem } = useContext(AccordionContext);
  const { itemId, isExpanded } = useContext(ItemContext);
  return <button onClick={() => toggleItem(itemId)} aria-expanded={isExpanded}>{children}</button>;
}

function AccordionContent({ children }) {
  const { isExpanded } = useContext(ItemContext);
  if (!isExpanded) return null;
  return <div role="region">{children}</div>;
}

Accordion.Item = AccordionItem;
Accordion.Header = AccordionHeader;
Accordion.Content = AccordionContent;
```
