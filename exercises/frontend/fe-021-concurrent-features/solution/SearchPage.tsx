import { useState, useTransition, useMemo } from "react";

// Simulates an expensive filtering/scoring operation
function computeExpensiveFilteredList(
  items: string[],
  query: string
): string[] {
  if (!query) return items;
  // Deliberately expensive: O(n * m) fuzzy matching simulation
  return items.filter((item) => {
    let score = 0;
    const lowerItem = item.toLowerCase();
    const lowerQuery = query.toLowerCase();
    for (let i = 0; i < lowerQuery.length; i++) {
      for (let j = 0; j < lowerItem.length; j++) {
        if (lowerQuery[i] === lowerItem[j]) score++;
      }
    }
    return score >= lowerQuery.length;
  });
}

const ALL_ITEMS = Array.from({ length: 5000 }, (_, i) => `Item ${i + 1}`);

export function SearchPage() {
  // Separate state: query is urgent (what the user typed), deferredQuery
  // drives the expensive computation and can lag behind via transition.
  const [query, setQuery] = useState("");
  const [deferredQuery, setDeferredQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  // FIX: The input update is URGENT (immediate), only the expensive
  // derived state is deferred inside the transition.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    startTransition(() => {
      setDeferredQuery(e.target.value);
    });
  };

  // Expensive computation is driven by deferredQuery, so it runs
  // inside the transition's lower-priority render.
  const filteredItems = useMemo(
    () => computeExpensiveFilteredList(ALL_ITEMS, deferredQuery),
    [deferredQuery]
  );

  return (
    <div>
      <h1>Product Search</h1>
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={handleChange}
        data-testid="search-input"
      />
      {isPending && <p data-testid="loading-indicator">Updating results...</p>}
      <p data-testid="result-count">{filteredItems.length} results</p>
      <ul data-testid="results-list">
        {filteredItems.slice(0, 20).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
