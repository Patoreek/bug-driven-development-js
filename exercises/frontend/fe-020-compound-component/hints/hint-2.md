You need two contexts:

1. **AccordionContext** — provided by `<Accordion>`, contains `expandedItems` (Set) and `toggleItem` function
2. **ItemContext** — provided by each `<Accordion.Item>`, contains `itemId` and `isExpanded`

`AccordionHeader` reads both contexts to get `toggleItem` and `itemId`. `AccordionContent` reads `ItemContext` to check `isExpanded`.
