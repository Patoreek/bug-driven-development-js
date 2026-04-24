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
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  // BUG: The urgent text input update is wrapped in startTransition,
  // making the typing feel laggy. Meanwhile, the expensive computation
  // runs synchronously outside any transition.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      setQuery(e.target.value);
    });
  };

  // This expensive computation runs on every render synchronously —
  // it should be the thing that's wrapped in a transition
  const filteredItems = useMemo(
    () => computeExpensiveFilteredList(ALL_ITEMS, query),
    [query]
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
